from rest_framework import serializers

from core.serializers import ProductSerializer
from useraccount.serializers import UserDetailSerializer
from .models import Address, Order, OrderItem

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'
        read_only_fields = ['user'] 



class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__' 

        

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__' 



class OrderItemListSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=False)
    total_price = serializers.SerializerMethodField()
    vendor_name = serializers.SerializerMethodField()
    vendor_id = serializers.SerializerMethodField()
    vendor_slug = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return obj.total_price()

    def get_vendor_name(self, obj):
        if obj.vendor:
            return obj.vendor.store_name
        return None

    def get_vendor_id(self, obj):
        if obj.vendor:
            return obj.vendor.id
        return None

    def get_vendor_slug(self, obj):
        if obj.vendor:
            return obj.vendor.slug
        return None
    
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'total_price', 'vendor_name', 'vendor_id', 'vendor_slug']

class OrderListSerializer(serializers.ModelSerializer):
    Order_items = OrderItemListSerializer(many=True)
    user = UserDetailSerializer()
    address = AddressSerializer()
    total_price = serializers.SerializerMethodField()
    def get_total_price(self, obj):
        return obj.total_price()
    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'delivered', 'status', 'created_at', 'updated_at', 'Order_items', 'total_price']
        depth = 1
