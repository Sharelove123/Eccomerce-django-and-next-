from django.contrib import admin

from .models import Product, Category, ImageList


class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'vendor', 'is_active', 'stock', 'orginalPrice', 'discountedPrice', 'created_at']
    list_filter = ['is_active', 'category', 'vendor', 'created_at']
    search_fields = ['title', 'vendor__store_name']
    list_editable = ['is_active', 'stock']


admin.site.register(Category)
admin.site.register(ImageList)
admin.site.register(Product, ProductAdmin)