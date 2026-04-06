from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.ProductReviewListCreateView.as_view(), name='product-reviews'),
    path('<int:pk>/', views.ProductReviewDetailView.as_view(), name='review-detail'),
]
