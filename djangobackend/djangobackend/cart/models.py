from django.db import models
from django.contrib.auth import get_user_model

from core.models import Product

User = get_user_model()


class Address(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="useraddresses"
    ) 
    country = models.CharField(max_length=100, null=False, blank=False, default="United States")
    state = models.CharField(max_length=100, null=False, blank=False)
    city = models.CharField(max_length=100, null=False, blank=False)
    street_name = models.CharField(max_length=255, null=False, blank=False)
    apartment_number = models.CharField(max_length=50, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=False, blank=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.street_name}, {self.city}, {self.state}, {self.country} - {self.postal_code}"

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"


ORDER_STATUS_CHOICES = [
    ('PENDING', 'Pending'),
    ('PROCESSING', 'Processing'),
    ('SHIPPED', 'Shipped'),
    ('DELIVERED', 'Delivered'),
    ('CANCELLED', 'Cancelled'),
]


class Order(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="Orders"
    )
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="Orders"
    )
    delivered = models.BooleanField(default=False)
    paid = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=ORDER_STATUS_CHOICES,
        default='PENDING',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} for {self.user.email} ({self.status})"

    def total_price(self):
        return sum(item.total_price() for item in self.Order_items.all())


class OrderItem(models.Model):
    Order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name="Order_items"
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE
    )
    vendor = models.ForeignKey(
        'vendor.Vendor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_items",
    )
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in Order {self.Order.id}"

    def total_price(self):
        return self.product.discountedPrice * self.quantity
