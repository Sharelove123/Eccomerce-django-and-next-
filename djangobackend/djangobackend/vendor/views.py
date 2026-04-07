from rest_framework import status
from rest_framework.generics import (
    CreateAPIView, RetrieveUpdateAPIView, ListAPIView, RetrieveAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.shortcuts import get_object_or_404

from .models import Vendor
from .serializers import (
    VendorRegistrationSerializer, VendorSerializer,
    VendorDashboardSerializer, VendorPublicSerializer, VendorMiniSerializer,
)
from .permissions import IsApprovedVendor, IsVendor
from core.models import Product, Category, ImageList
from core.serializers import ProductSerializer


class VendorProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 50


# ─── Registration ───────────────────────────────────────────────

class VendorRegisterView(CreateAPIView):
    """Register as a new vendor. Requires authentication."""
    serializer_class = VendorRegistrationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(is_approved=True)

    def create(self, request, *args, **kwargs):
        if hasattr(request.user, 'vendor_profile'):
            return Response(
                {'detail': 'You already have a vendor account.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {
                'status': 'success',
                'message': 'Vendor account created and automatically approved!',
                'vendor': serializer.data,
            },
            status=status.HTTP_201_CREATED
        )


# ─── Own Profile ────────────────────────────────────────────────

class VendorProfileView(RetrieveUpdateAPIView):
    """Get or update own vendor profile."""
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated, IsVendor]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user.vendor_profile


# ─── Dashboard ──────────────────────────────────────────────────

class VendorDashboardView(RetrieveAPIView):
    """Vendor dashboard with stats."""
    serializer_class = VendorDashboardSerializer
    permission_classes = [IsAuthenticated, IsVendor]

    def get_object(self):
        return self.request.user.vendor_profile


# ─── Vendor's Own Products ─────────────────────────────────────

class VendorProductListCreateView(APIView):
    """List vendor's own products or create a new one."""
    permission_classes = [IsAuthenticated, IsVendor]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        vendor = request.user.vendor_profile
        products = Product.objects.filter(vendor=vendor).order_by('-created_at')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        vendor = request.user.vendor_profile

        # Extract product data
        title = request.data.get('title')
        category_name = request.data.get('category')
        description = request.data.get('discription', '')
        original_price = request.data.get('orginalPrice')
        discounted_price = request.data.get('discountedPrice')
        stock = request.data.get('stock', 0)

        if not title or not category_name or not original_price:
            return Response(
                {'detail': 'title, category, and orginalPrice are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create category
        category, _ = Category.objects.get_or_create(name=category_name)

        # Handle images
        img1 = request.FILES.get('img1')
        img2 = request.FILES.get('img2')
        img3 = request.FILES.get('img3')
        img4 = request.FILES.get('img4')

        imagelist = None
        if img1 or img2 or img3 or img4:
            imagelist = ImageList.objects.create(
                img1=img1, img2=img2, img3=img3, img4=img4
            )

        product = Product.objects.create(
            title=title,
            category=category,
            discription=description,
            orginalPrice=float(original_price),
            discountedPrice=float(discounted_price or original_price),
            stock=int(stock),
            imagelist=imagelist,
            vendor=vendor,
            is_active=True,
        )

        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VendorProductDetailView(APIView):
    """Update or delete a vendor's own product."""
    permission_classes = [IsAuthenticated, IsVendor]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_product(self, pk, vendor):
        return get_object_or_404(Product, pk=pk, vendor=vendor)

    def get(self, request, pk):
        vendor = request.user.vendor_profile
        product = self.get_product(pk, vendor)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        vendor = request.user.vendor_profile
        product = self.get_product(pk, vendor)

        # Update fields
        for field in ['title', 'discription', 'orginalPrice', 'discountedPrice', 'stock', 'is_active']:
            if field in request.data:
                value = request.data[field]
                if field in ['orginalPrice', 'discountedPrice']:
                    value = float(value)
                elif field == 'stock':
                    value = int(value)
                elif field == 'is_active':
                    value = value in [True, 'true', 'True', '1']
                setattr(product, field, value)

        # Update category
        category_name = request.data.get('category')
        if category_name:
            category, _ = Category.objects.get_or_create(name=category_name)
            product.category = category

        # Update images
        img_updated = False
        img_fields = {}
        for field in ['img1', 'img2', 'img3', 'img4']:
            if field in request.FILES:
                img_fields[field] = request.FILES[field]
                img_updated = True

        if img_updated:
            if product.imagelist:
                for key, value in img_fields.items():
                    setattr(product.imagelist, key, value)
                product.imagelist.save()
            else:
                imagelist = ImageList.objects.create(**img_fields)
                product.imagelist = imagelist

        product.save()
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        vendor = request.user.vendor_profile
        product = self.get_product(pk, vendor)
        product.delete()
        return Response({'status': 'deleted'}, status=status.HTTP_204_NO_CONTENT)


# ─── Vendor Orders ──────────────────────────────────────────────

class VendorOrdersView(APIView):
    """List orders containing this vendor's products."""
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        from cart.models import Order, OrderItem
        from cart.serializers import OrderListSerializer

        vendor = request.user.vendor_profile
        # Get all orders that contain items from this vendor
        order_ids = OrderItem.objects.filter(vendor=vendor).values_list('Order_id', flat=True).distinct()
        orders = Order.objects.filter(id__in=order_ids).order_by('-created_at')

        serializer = OrderListSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)


class VendorOrderItemStatusView(APIView):
    """Update order status for vendor's items."""
    permission_classes = [IsAuthenticated, IsApprovedVendor]

    def patch(self, request, order_id):
        from cart.models import Order

        vendor = request.user.vendor_profile
        order = get_object_or_404(Order, id=order_id)

        # Verify this order has items from this vendor
        if not order.Order_items.filter(vendor=vendor).exists():
            return Response(
                {'detail': 'No items from your store in this order.'},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get('status')
        valid_statuses = ['PROCESSING', 'SHIPPED', 'DELIVERED']
        if new_status not in valid_statuses:
            return Response(
                {'detail': f'Invalid status. Choose from: {valid_statuses}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        if new_status == 'DELIVERED':
            order.delivered = True
        order.save()

        return Response({'status': 'updated', 'new_status': new_status})


# ─── Public Storefront ──────────────────────────────────────────

class VendorStorefrontView(RetrieveAPIView):
    """Public vendor storefront by slug."""
    serializer_class = VendorPublicSerializer
    permission_classes = []
    lookup_field = 'slug'
    queryset = Vendor.objects.filter(is_approved=True)


class VendorStorefrontProductsView(ListAPIView):
    """List products from a vendor's store."""
    serializer_class = ProductSerializer
    permission_classes = []
    pagination_class = VendorProductPagination

    def get_queryset(self):
        slug = self.kwargs['slug']
        return Product.objects.filter(
            vendor__slug=slug,
            vendor__is_approved=True,
            is_active=True,
        ).order_by('-created_at')


# ─── Vendor List (for browsing all vendors) ────────────────────

class VendorListView(ListAPIView):
    """Public list of all approved vendors."""
    serializer_class = VendorPublicSerializer
    permission_classes = []
    queryset = Vendor.objects.filter(is_approved=True)


# ─── Check Vendor Status ───────────────────────────────────────

class VendorStatusView(APIView):
    """Check if current user is a vendor and their approval status."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        vendor = getattr(request.user, 'vendor_profile', None)
        if vendor:
            return Response({
                'is_vendor': True,
                'is_approved': vendor.is_approved,
                'store_name': vendor.store_name,
                'slug': vendor.slug,
            })
        return Response({
            'is_vendor': False,
            'is_approved': False,
        })
