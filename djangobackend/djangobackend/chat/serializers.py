from rest_framework import serializers

from .models import ChatMessage, ChatThread


class ChatUserSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.name or obj.email

    def get_avatar_url(self, obj):
        if getattr(obj, 'avatar', None):
            return obj.avatar_url()
        return ''


class ChatVendorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    store_name = serializers.CharField()
    slug = serializers.SlugField()
    store_logo = serializers.SerializerMethodField()

    def get_store_logo(self, obj):
        if obj.store_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.store_logo.url)
            return obj.store_logo.url
        return None


class ChatProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.imagelist and obj.imagelist.img1:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagelist.img1.url)
            return obj.imagelist.img1.url
        return None


class ChatMessageSerializer(serializers.ModelSerializer):
    sender = ChatUserSerializer(read_only=True)
    is_own_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'content', 'is_read', 'is_own_message', 'created_at']
        read_only_fields = fields

    def get_is_own_message(self, obj):
        request = self.context.get('request')
        return bool(request and request.user.is_authenticated and obj.sender_id == request.user.id)


class ChatThreadSummarySerializer(serializers.ModelSerializer):
    vendor = ChatVendorSerializer(read_only=True)
    customer = ChatUserSerializer(read_only=True)
    product = ChatProductSerializer(read_only=True)
    counterpart = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    subject = serializers.SerializerMethodField()

    class Meta:
        model = ChatThread
        fields = [
            'id', 'vendor', 'customer', 'product', 'counterpart',
            'subject', 'last_message', 'unread_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields

    def _get_messages(self, obj):
        prefetched = getattr(obj, '_prefetched_objects_cache', {})
        if 'messages' in prefetched:
            return list(prefetched['messages'])
        return list(obj.messages.select_related('sender').all())

    def get_counterpart(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and obj.vendor.user_id == request.user.id:
            return {
                'id': str(obj.customer_id),
                'name': obj.customer.name or obj.customer.email,
                'avatar_url': obj.customer.avatar_url() if getattr(obj.customer, 'avatar', None) else '',
                'role': 'customer',
            }

        return {
            'id': str(obj.vendor.user_id),
            'name': obj.vendor.store_name,
            'avatar_url': self._build_vendor_logo_url(obj),
            'role': 'vendor',
            'store_name': obj.vendor.store_name,
            'slug': obj.vendor.slug,
        }

    def _build_vendor_logo_url(self, obj):
        if not obj.vendor.store_logo:
            return ''

        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.vendor.store_logo.url)
        return obj.vendor.store_logo.url

    def get_last_message(self, obj):
        messages = self._get_messages(obj)
        if not messages:
            return None
        return ChatMessageSerializer(messages[-1], context=self.context).data

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0

        return sum(
            1 for message in self._get_messages(obj)
            if not message.is_read and message.sender_id != request.user.id
        )

    def get_subject(self, obj):
        if obj.product:
            return f'{obj.vendor.store_name} about {obj.product.title}'
        return f'{obj.vendor.store_name} support chat'


class ChatThreadDetailSerializer(ChatThreadSummarySerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta(ChatThreadSummarySerializer.Meta):
        fields = ChatThreadSummarySerializer.Meta.fields + ['messages']
        read_only_fields = fields
