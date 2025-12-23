from django.urls import path


from . import views

urlpatterns = [
    path('createproduct/', views.CreateProduct.as_view(), name='createproduct'),
    path('getproduct/<int:pk>', views.RetriveProduct.as_view(), name='getproduct'),
    path('category/<str:category_name>/', views.ProductByCategoryView.as_view(), name='products-by-category'),
]