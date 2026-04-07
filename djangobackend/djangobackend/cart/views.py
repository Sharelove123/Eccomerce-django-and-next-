import json
from django.forms import ValidationError
from django.shortcuts import render
from decimal import Decimal
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from .permissions import IsModelUser
from rest_framework.views import APIView
from . import models
from . import serializers
from rest_framework.viewsets import ModelViewSet
from core.models import Product
from rest_framework.exceptions import ValidationError as DRFValidationError


class AddressCurd(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = models.Address.objects.all()
    serializer_class = serializers.AddressSerializer
    lookup_field = 'id'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            raise PermissionDenied("You do not have permission to access this address.")
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CreateOrderView(APIView):
    serializers = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]
    queryset = models.Order.objects.all()

    def post(self, request, *args, **kwargs):
        order_items = request.data.get('order_items', [])
        address_id = request.data.get('address')
        payment_method = request.data.get('payment_method', 'ONLINE')
        
        if not order_items:
            return Response({'status': 'failed', 'message': 'Inventory list (order_items) is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not address_id:
            return Response({'status': 'failed', 'message': 'Destination address is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the main order
            is_paid = False if payment_method == 'COD' else True
            order_data = {
                'user': request.user.id,
                'address': address_id,
                'paid': is_paid,
                'status': 'PENDING',
            }
            order_serializer = self.serializers(data=order_data)
            order_serializer.is_valid(raise_exception=True)
            order = order_serializer.save()

            # Create individual items with vendor tracking
            for item in order_items:
                product_id = item.get('product')
                quantity = item.get('quantity', 1)
                
                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    return Response({'status': 'failed', 'message': f'Product ID {product_id} not found.'}, status=status.HTTP_400_BAD_REQUEST)

                item_data = {
                    'Order': order.id,
                    'product': product_id,
                    'quantity': quantity,
                    'vendor': product.vendor_id,  # Auto-populate vendor from product
                }
                item_serializer = serializers.OrderItemSerializer(data=item_data)
                item_serializer.is_valid(raise_exception=True)
                item_serializer.save()

                # Update vendor sales stats
                if product.vendor:
                    vendor = product.vendor
                    vendor.total_sales_count += quantity
                    item_total = Decimal(str(product.discountedPrice)) * Decimal(str(quantity))
                    vendor.total_revenue += item_total
                    vendor.save(update_fields=['total_sales_count', 'total_revenue'])

            return Response({
                'status': 'success',
                'message': 'Order successfully recorded.',
                'order_id': order.id,
            }, status=status.HTTP_201_CREATED)

        except DRFValidationError as e:
            return Response({
                'status': 'failed',
                'message': e.detail,
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Checkout error: {str(e)}")
            return Response({
                'status': 'failed',
                'message': str(e) or 'Internal processing error during checkout.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

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
        order_id = self.request.query_params.get('orderID')
        if not order_id:
            raise ValidationError("orderID query parameter is required.")
        try:
            order = models.Order.objects.get(id=order_id)
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
