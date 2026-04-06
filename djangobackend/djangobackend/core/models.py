from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=25,null=True,blank=True)

    def __str__(self):
        return self.name

class ImageList(models.Model):
    img1 = models.ImageField(upload_to='productImage',null=True,blank=True)
    img2 = models.ImageField(upload_to='productImage',null=True,blank=True)
    img3 = models.ImageField(upload_to='productImage',null=True,blank=True)
    img4 = models.ImageField(upload_to='productImage',null=True,blank=True)

    @property
    def urlList(self):
        return [
            self.img1.url,
            self.img2.url,
            self.img3.url,
            self.img4.url,
        ]

    

class Product(models.Model):
    title = models.CharField(max_length=25,null=True,blank=True)
    category = models.ForeignKey(Category,null=True,related_name='category',on_delete=models.SET_NULL)
    vendor = models.ForeignKey(
        'vendor.Vendor',
        on_delete=models.CASCADE,
        related_name='products',
        null=True,
        blank=True,
    )
    rateing = models.FloatField(null=True,blank=True)
    orginalPrice = models.FloatField(null=True,blank=True,default=4)
    discountedPrice = models.FloatField(null=True,blank=True,default=1)
    discription =  models.TextField(null=True,blank=True)
    imagelist = models.ForeignKey(ImageList,related_name='imgList',null=True,on_delete=models.SET_NULL)
    is_active = models.BooleanField(default=True)
    stock = models.PositiveIntegerField(default=0, help_text="Available inventory count")
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        vendor_name = self.vendor.store_name if self.vendor else "No Vendor"
        return f'{self.title} - {vendor_name} ({self.category.name if self.category else "No Category"})'
    
    def get_discount_percentage(self):
        if self.orginalPrice and self.discountedPrice:
            discount = ((self.orginalPrice - self.discountedPrice) / self.orginalPrice) * 100
            return round(discount, 2)
        return None
    

class ContactUs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contactus",null=True) 
    name = models.CharField(max_length=25,null=True,blank=True)
    email = models.EmailField()
    title = models.CharField(max_length=25,null=True,blank=True)
    discription =  models.TextField(null=True,blank=True)
