from django.contrib import admin

from .models import ChatMessage, ChatThread


@admin.register(ChatThread)
class ChatThreadAdmin(admin.ModelAdmin):
    list_display = ['id', 'vendor', 'customer', 'product', 'created_at', 'updated_at']
    list_filter = ['vendor', 'created_at', 'updated_at']
    search_fields = ['vendor__store_name', 'customer__email', 'customer__name', 'product__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'thread', 'sender', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__email', 'sender__name', 'content']
    readonly_fields = ['created_at']
