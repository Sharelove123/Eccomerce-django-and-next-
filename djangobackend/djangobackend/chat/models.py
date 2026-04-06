from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone


User = get_user_model()


class ChatThread(models.Model):
    vendor = models.ForeignKey(
        'vendor.Vendor',
        on_delete=models.CASCADE,
        related_name='chat_threads',
    )
    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='customer_chat_threads',
    )
    product = models.ForeignKey(
        'core.Product',
        on_delete=models.SET_NULL,
        related_name='chat_threads',
        null=True,
        blank=True,
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='created_chat_threads',
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(
                fields=['vendor', 'customer', 'product'],
                name='unique_chat_thread_scope',
            )
        ]

    def __str__(self):
        product_title = self.product.title if self.product else 'General'
        return f'{self.vendor.store_name} <> {self.customer.email} ({product_title})'


class ChatMessage(models.Model):
    thread = models.ForeignKey(
        ChatThread,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_chat_messages',
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            ChatThread.objects.filter(pk=self.thread_id).update(updated_at=timezone.now())

    def __str__(self):
        return f'Message #{self.pk} in thread #{self.thread_id}'
