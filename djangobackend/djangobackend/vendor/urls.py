from django.urls import path
from . import views

urlpatterns = [
    # Registration & status
    path('register/', views.VendorRegisterView.as_view(), name='vendor-register'),
    path('status/', views.VendorStatusView.as_view(), name='vendor-status'),

    # Own profile & dashboard
    path('me/', views.VendorProfileView.as_view(), name='vendor-profile'),
    path('me/dashboard/', views.VendorDashboardView.as_view(), name='vendor-dashboard'),

    # Vendor's own products
    path('me/products/', views.VendorProductListCreateView.as_view(), name='vendor-products'),
    path('me/products/<int:pk>/', views.VendorProductDetailView.as_view(), name='vendor-product-detail'),

    # Vendor's orders
    path('me/orders/', views.VendorOrdersView.as_view(), name='vendor-orders'),
    path('me/orders/<int:order_id>/status/', views.VendorOrderItemStatusView.as_view(), name='vendor-order-status'),

    # Public storefront
    path('store/<slug:slug>/', views.VendorStorefrontView.as_view(), name='vendor-storefront'),
    path('store/<slug:slug>/products/', views.VendorStorefrontProductsView.as_view(), name='vendor-storefront-products'),

    # Browse all vendors
    path('list/', views.VendorListView.as_view(), name='vendor-list'),
]
