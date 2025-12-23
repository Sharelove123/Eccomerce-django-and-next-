from django.contrib import admin
from .models import Address,OrderItem,Order
# Register your models here.

admin.site.register(Address)
admin.site.register(OrderItem)
admin.site.register(Order)