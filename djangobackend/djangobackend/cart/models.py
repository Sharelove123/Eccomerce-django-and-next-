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
    country = models.CharField(max_length=100, null=False, blank=False, default="United States")  # Country
    state = models.CharField(max_length=100, null=False, blank=False)  # State/Province
    city = models.CharField(max_length=100, null=False, blank=False)  # City
    street_name = models.CharField(max_length=255, null=False, blank=False)  # Street name
    apartment_number = models.CharField(max_length=50, null=True, blank=True)  # Optional apartment/unit number
    postal_code = models.CharField(max_length=20, null=False, blank=False)  # Postal/ZIP Code

    # Optional additional fields
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for record creation
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for record updates

    def __str__(self):
        # String representation of the address
        return f"{self.street_name}, {self.city}, {self.state}, {self.country} - {self.postal_code}"

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"


class Order(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="Orders"
    )  # Each Order belongs to a user
    address = models.ForeignKey(
        Address,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="Orders"
    )  # Address associated with the Order (optional)
    delivered = models.BooleanField(default=False)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} for {self.user.email}"

    def total_price(self):
        # Calculate total price for all items in the Order
        return sum(item.total_price() for item in self.Order_items.all())

class OrderItem(models.Model):
    Order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name="Order_items"
    )  # Each Order item is linked to a specific Order
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE
    )  # Each Order item is linked to a specific product
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} in Order {self.Order.id}"

    def total_price(self):
        # Calculate total price for this Order item
        return self.product.discountedPrice * self.quantity

