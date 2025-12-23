from rest_framework import serializers
from .import models

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['name']  

class ImageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ImageList
        fields = ['img1', 'img2', 'img3', 'img4']  



class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer() 
    imagelist = ImageListSerializer()
    get_discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = ['id', 'title', 'category', 'rateing', 'orginalPrice', 'discountedPrice', 'discription', 'imagelist', 'created_at', 'get_discount_percentage']

        read_only_fields = ['created_at','get_discount_percentage']

    def get_discount_percentage(self, obj):
        return obj.get_discount_percentage()

    def create(self, validated_data):
        # Extract nested data
        category_data = validated_data.pop('category')
        imagelist_data = validated_data.pop('imagelist')
        discount_percentage = serializers.SerializerMethodField()

        # Create Category instance
        category_instance = models.Category.objects.create(**category_data)

        # Create ImageList instance
        imagelist_instance = models.ImageList.objects.create(**imagelist_data)

        # Create Product instance
        product = models.Product.objects.create(
            category=category_instance,
            imagelist=imagelist_instance,
            **validated_data
        )

        return product
        