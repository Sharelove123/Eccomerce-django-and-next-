import json
from django.forms import ValidationError
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView,UpdateAPIView
from .permissions import IsModelUser
from rest_framework.views import APIView
from . import models
from . import serializers
from rest_framework.viewsets import ModelViewSet

class AddressCurd(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer
    lookup_field = 'id'


    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            raise PermissionDenied("You do not have permission to access this address.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


'''
class CreateOrderView(CreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer
    lookup_field = 'id'

    def perform_create(self, serializer):
        order_items = self.request.data.get('order_items')
        if not order_items:
            raise serializers.ValidationError({"order_items": "This field is required."})
        serializer.save(order_items=order_items)
'''

class CreateOrderView(APIView):
    serializers = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = models.Order.objects.all()

    def post(self, request, *args, **kwargs):
        print(request.data)
        order_items = request.data.get('order_items') 
        if not order_items:
            return Response({
                'status': 'failed',
                'message': 'order_items is required.'
            },status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(order_items, str):
            order_items = json.loads(order_items)
        if len(order_items)==0:
            return Response({
                'status': 'failed',
                'message': 'order_items is required.'
            },status=status.HTTP_400_BAD_REQUEST)
        
        address = request.data.get('address')
        if not address:
            return Response({
                'status': 'failed',
                'message': 'address is required.'
            },status=status.HTTP_400_BAD_REQUEST)
        
        order_data = {
            'user': request.data.get('user'),
            'address': address,
            'paid':True
        }
        order = self.serializers(data=order_data)
        order.is_valid(raise_exception=True)
        order.save()

        for order_item_data in order_items:
            product_id = order_item_data.get('product')
            product = models.Product.objects.get(id=product_id)
            quantity = order_item_data.get('quantity')
            order_item_data = {
            'Order': order.instance.id,
            'product': product_id,
            'quantity': quantity
            }
            order_item_serializer = serializers.OrderItemSerializer(data=order_item_data)
            order_item_serializer.is_valid(raise_exception=True)
            order_item_serializer.save()
        
        return Response({
            'status': 'success',
            'message': 'Order created successfully.',
            'order_id': order.instance.id,
        },status=status.HTTP_201_CREATED)
    

class ListOrder(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderListSerializer

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)
        return queryset
    
class ListOrderItem(ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = models.OrderItem.objects.all()
    serializer_class = serializers.OrderItemListSerializer

    def get_queryset(self):
        order_id = self.request.query_params.get('orderID')  # Corrected method to fetch query parameter
        if not order_id:
            raise ValidationError("orderID query parameter is required.")
        try:
            order = models.Order.objects.get(id=order_id)  # Ensure the order belongs to the authenticated user
        except models.Order.DoesNotExist:
            raise ValidationError("Order not found or you do not have permission to access it.")
        return self.queryset.filter(Order=order)


class UpadteOrder(UpdateAPIView):
    serializer_class = serializers.OrderSerializer
    queryset = models.Order.objects.all()


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            raise PermissionDenied("You do not have permission to access this address.")
        return super().update(request, *args, **kwargs)
















