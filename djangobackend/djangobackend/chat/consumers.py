from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings

from .models import ChatMessage, ChatThread
from .socket_auth import SOCKET_TOKEN_MAX_AGE


def absolute_media_url(url):
    if not url:
        return ''
    if url.startswith('http://') or url.startswith('https://'):
        return url
    return f'{settings.WEBSITE_URL}{url}'


def serialize_user(user):
    return {
        'id': str(user.id),
        'name': user.name or user.email,
        'avatar_url': user.avatar_url() if getattr(user, 'avatar', None) else '',
    }


def serialize_message(message, current_user_id):
    return {
        'id': message.id,
        'sender': serialize_user(message.sender),
        'content': message.content,
        'is_read': message.is_read,
        'is_own_message': str(message.sender_id) == str(current_user_id),
        'created_at': message.created_at.isoformat(),
    }


class ChatThreadConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        route_thread_id = self.scope['url_route']['kwargs']['thread_id']
        token_thread_id = self.scope.get('socket_thread_id')

        if not user or not user.is_authenticated:
            await self.close(code=4401)
            return

        if str(route_thread_id) != str(token_thread_id):
            await self.close(code=4403)
            return

        self.thread = await self.get_thread_for_user(route_thread_id, user.id)
        if not self.thread:
            await self.close(code=4404)
            return

        self.thread_group_name = f'chat_thread_{self.thread.id}'

        await self.channel_layer.group_add(self.thread_group_name, self.channel_name)
        await self.accept()
        await self.mark_thread_read(self.thread.id, user.id)

        await self.send_json(
            {
                'type': 'chat.connected',
                'thread_id': self.thread.id,
                'token_ttl_seconds': SOCKET_TOKEN_MAX_AGE,
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'thread_group_name'):
            await self.channel_layer.group_discard(self.thread_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        action = content.get('action')

        if action != 'send_message':
            await self.send_json(
                {
                    'type': 'chat.error',
                    'detail': 'Unsupported action.',
                }
            )
            return

        message_text = (content.get('content') or '').strip()
        if not message_text:
            await self.send_json(
                {
                    'type': 'chat.error',
                    'detail': 'Message content is required.',
                }
            )
            return

        message = await self.create_message(
            thread_id=self.thread.id,
            sender_id=self.scope['user'].id,
            content=message_text,
        )

        await self.channel_layer.group_send(
            self.thread_group_name,
            {
                'type': 'chat_message_event',
                'thread_id': self.thread.id,
                'message_id': message.id,
            }
        )

    async def chat_message_event(self, event):
        message = await self.get_message(event['message_id'])
        if not message:
            return

        if str(message.sender_id) != str(self.scope['user'].id):
            await self.mark_message_read(message.id)
            message.is_read = True

        await self.send_json(
            {
                'type': 'chat.message',
                'thread_id': event['thread_id'],
                'message': serialize_message(message, self.scope['user'].id),
            }
        )

    @database_sync_to_async
    def get_thread_for_user(self, thread_id, user_id):
        try:
            thread = ChatThread.objects.select_related(
                'vendor',
                'vendor__user',
                'customer',
            ).get(pk=thread_id)
        except ChatThread.DoesNotExist:
            return None

        if str(thread.customer_id) != str(user_id) and str(thread.vendor.user_id) != str(user_id):
            return None

        return thread

    @database_sync_to_async
    def create_message(self, *, thread_id, sender_id, content):
        message = ChatMessage.objects.create(
            thread_id=thread_id,
            sender_id=sender_id,
            content=content,
        )
        return ChatMessage.objects.select_related('sender').get(pk=message.pk)

    @database_sync_to_async
    def get_message(self, message_id):
        try:
            return ChatMessage.objects.select_related('sender').get(pk=message_id)
        except ChatMessage.DoesNotExist:
            return None

    @database_sync_to_async
    def mark_thread_read(self, thread_id, user_id):
        ChatMessage.objects.filter(
            thread_id=thread_id,
            is_read=False,
        ).exclude(sender_id=user_id).update(is_read=True)

    @database_sync_to_async
    def mark_message_read(self, message_id):
        ChatMessage.objects.filter(pk=message_id, is_read=False).update(is_read=True)
