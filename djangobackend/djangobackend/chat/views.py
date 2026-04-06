from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Product
from vendor.models import Vendor

from .models import ChatMessage, ChatThread
from .socket_auth import SOCKET_TOKEN_MAX_AGE, create_socket_token
from .serializers import ChatMessageSerializer, ChatThreadDetailSerializer, ChatThreadSummarySerializer


User = get_user_model()


class ChatQuerysetMixin:
    def base_queryset(self):
        return ChatThread.objects.select_related(
            'vendor',
            'vendor__user',
            'customer',
            'product',
            'product__imagelist',
        ).prefetch_related(
            Prefetch(
                'messages',
                queryset=ChatMessage.objects.select_related('sender').order_by('created_at'),
            )
        )

    def filter_for_user(self, queryset, user, role='all'):
        if role == 'vendor':
            vendor = getattr(user, 'vendor_profile', None)
            if not vendor:
                return queryset.none()
            return queryset.filter(vendor=vendor)

        if role == 'customer':
            return queryset.filter(customer=user)

        return queryset.filter(
            Q(customer=user) | Q(vendor__user=user)
        ).distinct()

    def get_thread(self, request, pk):
        queryset = self.filter_for_user(self.base_queryset(), request.user, role='all')
        return get_object_or_404(queryset, pk=pk)


class ChatThreadListCreateView(ChatQuerysetMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        role = request.query_params.get('role', 'all')
        queryset = self.filter_for_user(self.base_queryset(), request.user, role=role)
        serializer = ChatThreadSummarySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        vendor = None
        customer = None
        product = None

        customer_id = request.data.get('customer_id')
        vendor_id = request.data.get('vendor_id')
        product_id = request.data.get('product_id')

        if customer_id:
            vendor = getattr(request.user, 'vendor_profile', None)
            if not vendor:
                return Response(
                    {'detail': 'Only vendors can start chats with customers.'},
                    status=status.HTTP_403_FORBIDDEN,
                )
            customer = get_object_or_404(User, pk=customer_id)
        else:
            if not vendor_id:
                return Response(
                    {'detail': 'vendor_id is required when customer_id is not provided.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            vendor = get_object_or_404(Vendor, pk=vendor_id)
            customer = request.user

        if vendor.user_id == customer.id:
            return Response(
                {'detail': 'You cannot create a chat with yourself.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if product_id:
            product = get_object_or_404(Product, pk=product_id, vendor=vendor)

        thread, created = ChatThread.objects.get_or_create(
            vendor=vendor,
            customer=customer,
            product=product,
            defaults={'created_by': request.user},
        )

        thread = self.base_queryset().get(pk=thread.pk)
        serializer = ChatThreadDetailSerializer(thread, context={'request': request})
        return Response(
            {'created': created, 'thread': serializer.data},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class ChatThreadDetailView(ChatQuerysetMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        thread = self.get_thread(request, pk)
        thread.messages.exclude(sender=request.user).filter(is_read=False).update(is_read=True)
        thread = self.base_queryset().get(pk=thread.pk)
        serializer = ChatThreadDetailSerializer(thread, context={'request': request})
        return Response(serializer.data)


class ChatMessageCreateView(ChatQuerysetMixin, APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        thread = self.get_thread(request, pk)
        content = (request.data.get('content') or '').strip()

        if not content:
            return Response(
                {'detail': 'Message content is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        message = ChatMessage.objects.create(
            thread=thread,
            sender=request.user,
            content=content,
        )

        serializer = ChatMessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChatSocketAuthView(ChatQuerysetMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        thread = self.get_thread(request, pk)
        token = create_socket_token(
            user_id=request.user.id,
            thread_id=thread.id,
        )
        ws_scheme = 'wss' if request.is_secure() else 'ws'
        ws_path = f'/ws/chat/threads/{thread.id}/'
        ws_url = f'{ws_scheme}://{request.get_host()}{ws_path}?token={token}'

        return Response(
            {
                'thread_id': thread.id,
                'token': token,
                'expires_in': SOCKET_TOKEN_MAX_AGE,
                'ws_url': ws_url,
            }
        )
