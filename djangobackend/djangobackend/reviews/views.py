from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.db import models
from django.db.models import Avg, Count

from .models import ProductReview
from .serializers import ProductReviewSerializer, ProductReviewCreateSerializer
from core.models import Product


class ProductReviewListCreateView(ListCreateAPIView):
    """
    GET: List all reviews for a product (public).
    POST: Create a review for a product (authenticated).
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductReviewCreateSerializer
        return ProductReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(product_id=product_id).select_related('user')

    def create(self, request, *args, **kwargs):
        product_id = self.kwargs['product_id']
        product = get_object_or_404(Product, id=product_id)

        # Check if user already reviewed
        if ProductReview.objects.filter(product=product, user=request.user).exists():
            return Response(
                {'detail': 'You have already reviewed this product.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save(product=product, user=request.user)

        # Update product average rating
        avg = ProductReview.objects.filter(product=product).aggregate(avg=Avg('rating'))
        product.rateing = round(avg['avg'] or 0, 1)
        product.save(update_fields=['rateing'])

        return Response(
            ProductReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = ProductReviewSerializer(queryset, many=True)

        # Also return aggregate stats
        product_id = self.kwargs['product_id']
        stats = ProductReview.objects.filter(product_id=product_id).aggregate(
            avg_rating=Avg('rating'),
            total_reviews=Count('id'),
        )

        return Response({
            'reviews': serializer.data,
            'avg_rating': round(stats['avg_rating'] or 0, 1),
            'total_reviews': stats['total_reviews'],
        })


class ProductReviewDetailView(RetrieveUpdateDestroyAPIView):
    """Update or delete own review."""
    serializer_class = ProductReviewCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductReview.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        review = serializer.save()
        # Recalculate product rating
        product = review.product
        avg = ProductReview.objects.filter(product=product).aggregate(avg=Avg('rating'))
        product.rateing = round(avg['avg'] or 0, 1)
        product.save(update_fields=['rateing'])

    def perform_destroy(self, instance):
        product = instance.product
        instance.delete()
        # Recalculate product rating
        avg = ProductReview.objects.filter(product=product).aggregate(avg=Avg('rating'))
        product.rateing = round(avg['avg'] or 0, 1)
        product.save(update_fields=['rateing'])
