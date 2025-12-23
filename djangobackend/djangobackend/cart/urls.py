from django.urls import include, path

from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'addresses', views.AddressCurd, basename='address')

urlpatterns = [
    path('', include(router.urls)),
    path('createorder/', views.CreateOrderView.as_view(), name='createorder'),
    path('listorder/', views.ListOrder.as_view(), name='listorder'),
    path('listorderitem/', views.ListOrderItem.as_view(), name='listorder'),
]