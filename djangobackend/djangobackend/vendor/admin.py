from django.contrib import admin
from .models import Vendor


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = [
        'store_name', 'user', 'is_approved', 'commission_rate',
        'total_revenue', 'total_sales_count', 'created_at',
    ]
    list_filter = ['is_approved', 'created_at']
    search_fields = ['store_name', 'user__email', 'user__name']
    list_editable = ['is_approved', 'commission_rate']
    readonly_fields = ['slug', 'total_revenue', 'total_sales_count', 'created_at', 'updated_at']
    prepopulated_fields = {}

    actions = ['approve_vendors', 'reject_vendors']

    def approve_vendors(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} vendor(s) approved.")
    approve_vendors.short_description = "Approve selected vendors"

    def reject_vendors(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} vendor(s) rejected.")
    reject_vendors.short_description = "Reject selected vendors"
