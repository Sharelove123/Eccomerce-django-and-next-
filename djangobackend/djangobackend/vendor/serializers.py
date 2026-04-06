from rest_framework import serializers
from .models import Vendor


class VendorMiniSerializer(serializers.ModelSerializer):
    """Lightweight serializer for embedding in product cards."""
    class Meta:
        model = Vendor
        fields = ['id', 'store_name', 'slug', 'store_logo']


class VendorSerializer(serializers.ModelSerializer):
    """Full vendor detail for storefront."""
    product_count = serializers.IntegerField(read_only=True, source='product_count')
    average_rating = serializers.FloatField(read_only=True, source='average_rating')
    owner_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'store_description',
            'store_logo', 'store_banner', 'phone', 'address',
            'is_approved', 'commission_rate', 'total_revenue',
            'total_sales_count', 'product_count', 'average_rating',
            'owner_name', 'created_at',
        ]
        read_only_fields = [
            'id', 'slug', 'is_approved', 'commission_rate',
            'total_revenue', 'total_sales_count', 'created_at',
        ]


class VendorRegistrationSerializer(serializers.ModelSerializer):
    """For vendor signup."""
    class Meta:
        model = Vendor
        fields = [
            'store_name', 'store_description', 'store_logo',
            'store_banner', 'phone', 'address',
        ]

    def validate_store_name(self, value):
        if Vendor.objects.filter(store_name__iexact=value).exists():
            raise serializers.ValidationError("A store with this name already exists.")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        if hasattr(user, 'vendor_profile'):
            raise serializers.ValidationError("You already have a vendor account.")
        vendor = Vendor.objects.create(user=user, **validated_data)
        return vendor


class VendorDashboardSerializer(serializers.ModelSerializer):
    """Dashboard stats serializer."""
    product_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    pending_orders_count = serializers.SerializerMethodField()
    recent_orders = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'is_approved',
            'total_revenue', 'total_sales_count', 'commission_rate',
            'product_count', 'average_rating', 'pending_orders_count',
            'recent_orders', 'created_at',
        ]

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

    def get_average_rating(self, obj):
        from django.db.models import Avg
        avg = obj.products.aggregate(avg_rating=Avg('reviews__rating'))
        return round(avg['avg_rating'] or 0, 1)

    def get_pending_orders_count(self, obj):
        from cart.models import OrderItem
        return OrderItem.objects.filter(
            vendor=obj,
            Order__status__in=['PENDING', 'PROCESSING']
        ).values('Order').distinct().count()

    def get_recent_orders(self, obj):
        from cart.models import OrderItem
        from cart.serializers import OrderItemListSerializer
        recent_items = OrderItem.objects.filter(vendor=obj).select_related(
            'Order', 'product'
        ).order_by('-Order__created_at')[:10]
        return OrderItemListSerializer(recent_items, many=True, context=self.context).data


class VendorPublicSerializer(serializers.ModelSerializer):
    """Public-facing serializer for storefronts (no sensitive data)."""
    product_count = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = [
            'id', 'store_name', 'slug', 'store_description',
            'store_logo', 'store_banner', 'product_count',
            'average_rating', 'created_at',
        ]

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

    def get_average_rating(self, obj):
        from django.db.models import Avg
        avg = obj.products.aggregate(avg_rating=Avg('reviews__rating'))
        return round(avg['avg_rating'] or 0, 1)
