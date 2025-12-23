from django.contrib import admin

from .models import Product,Category,ImageList



admin.site.register(Category)
admin.site.register(ImageList)

admin.site.register(Product)