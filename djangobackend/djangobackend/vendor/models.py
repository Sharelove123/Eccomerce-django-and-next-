from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Vendor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='vendor_profile'
    )
    store_name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    store_description = models.TextField(blank=True, default='')
    store_logo = models.ImageField(upload_to='vendor/logos/', blank=True, null=True)
    store_banner = models.ImageField(upload_to='vendor/banners/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')

    is_approved = models.BooleanField(default=False)
    commission_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10.00,
        help_text="Platform commission percentage taken from each sale"
    )

    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_sales_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.store_name)
            slug = base_slug
            counter = 1
            while Vendor.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.store_name

    @property
    def product_count(self):
        return self.products.filter(is_active=True).count()

    @property
    def average_rating(self):
        from django.db.models import Avg
        avg = self.products.aggregate(avg_rating=Avg('reviews__rating'))
        return round(avg['avg_rating'] or 0, 1)

    class Meta:
        verbose_name = "Vendor"
        verbose_name_plural = "Vendors"
        ordering = ['-created_at']
