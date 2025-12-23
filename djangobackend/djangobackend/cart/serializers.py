from rest_framework import serializers

from core.serializers import ProductSerializer
from useraccount.serializers import UserDetailSerializer
from .models import Address,Order, OrderItem

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__' 



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

    def get_total_price(self, obj):
        return obj.total_price()
    
    
    class Meta:
        model = OrderItem
        fields = ['id','product','quantity','total_price']

class OrderListSerializer(serializers.ModelSerializer):
    Order_items = OrderItemListSerializer(many=True)
    user = UserDetailSerializer()
    address = AddressSerializer()
    total_price = serializers.SerializerMethodField()
    def get_total_price(self, obj):
        return obj.total_price()
    class Meta:
        model = Order
        fields = ['id','user','address','delivered','created_at','updated_at','Order_items','total_price']
        depth = 1


