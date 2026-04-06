from rest_framework import serializers
from .import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['name']  

class ImageListSerializer(serializers.ModelSerializer):
    img1 = serializers.SerializerMethodField()
    img2 = serializers.SerializerMethodField()
    img3 = serializers.SerializerMethodField()
    img4 = serializers.SerializerMethodField()

    class Meta:
        model = models.ImageList
        fields = ['img1', 'img2', 'img3', 'img4']

    def _build_image_url(self, image):
        if not image:
            return None

        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(image.url)

        return image.url

    def get_img1(self, obj):
        return self._build_image_url(obj.img1)

    def get_img2(self, obj):
        return self._build_image_url(obj.img2)

    def get_img3(self, obj):
        return self._build_image_url(obj.img3)

    def get_img4(self, obj):
        return self._build_image_url(obj.img4)


class VendorMiniInlineSerializer(serializers.Serializer):
    """Inline vendor info for product cards — avoids circular imports."""
    id = serializers.IntegerField()
    store_name = serializers.CharField()
    slug = serializers.SlugField()
    store_logo = serializers.ImageField(required=False, allow_null=True)


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer() 
    imagelist = ImageListSerializer(allow_null=True)
    get_discount_percentage = serializers.SerializerMethodField()
    vendor = serializers.SerializerMethodField()

    class Meta:
        model = models.Product
        fields = [
            'id', 'title', 'category', 'rateing', 'orginalPrice',
            'discountedPrice', 'discription', 'imagelist', 'created_at',
            'get_discount_percentage', 'vendor', 'is_active', 'stock',
        ]
        read_only_fields = ['created_at', 'get_discount_percentage']

    def get_discount_percentage(self, obj):
        return obj.get_discount_percentage()

    def get_vendor(self, obj):
        if obj.vendor:
            request = self.context.get('request')
            store_logo = None
            if obj.vendor.store_logo:
                store_logo = request.build_absolute_uri(obj.vendor.store_logo.url) if request else obj.vendor.store_logo.url

            return {
                'id': obj.vendor.id,
                'store_name': obj.vendor.store_name,
                'slug': obj.vendor.slug,
                'store_logo': store_logo,
            }
        return None

    def create(self, validated_data):
        # Extract nested data
        category_data = validated_data.pop('category')
        imagelist_data = validated_data.pop('imagelist')

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
