from django.shortcuts import render
from . import models
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from .serializers import ProductSerializer
from .permissions import IsSuperUser


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CreateProduct(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = []

    def get_queryset(self):
        """Only show active products from approved vendors."""
        return models.Product.objects.filter(
            is_active=True,
        ).select_related('vendor', 'category', 'imagelist').order_by('-created_at')


class RetriveProduct(RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = []

    def get_queryset(self):
        return models.Product.objects.filter(
            is_active=True,
        ).select_related('vendor', 'category', 'imagelist')


class ProductByCategoryView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = []
    pagination_class = CustomPagination

    def get_queryset(self):
        category_name = self.kwargs['category_name']
        queryset = models.Product.objects.filter(
            is_active=True,
        ).select_related('vendor', 'category', 'imagelist')

        if category_name != 'All':
            queryset = queryset.filter(category__name=category_name)

        return queryset.order_by('-created_at')


class ProductSearchView(ListAPIView):
    """Search products by title or description."""
    serializer_class = ProductSerializer
    permission_classes = []
    pagination_class = CustomPagination

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return models.Product.objects.filter(
            is_active=True,
            title__icontains=query,
        ).select_related('vendor', 'category', 'imagelist').order_by('-created_at')
