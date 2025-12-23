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
    queryset = models.Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = []

class RetriveProduct(RetrieveAPIView):
    queryset = models.Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = []


class ProductByCategoryView(ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = []
    pagination_class = CustomPagination

    def get_queryset(self):
        category_name = self.kwargs['category_name']
        return models.Product.objects.filter(category__name=category_name)






