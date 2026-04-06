from rest_framework import permissions


class IsApprovedVendor(permissions.BasePermission):
    """
    Only allows access to vendors whose account has been approved by admin.
    """
    message = "Your vendor account is pending approval."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        vendor = getattr(request.user, 'vendor_profile', None)
        if not vendor:
            return False
        return vendor.is_approved


class IsVendorOwner(permissions.BasePermission):
    """
    Ensures vendors can only manage their own resources (products, etc).
    """

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        vendor = getattr(request.user, 'vendor_profile', None)
        if not vendor:
            return False
        # Check if the object has a vendor field pointing to the requesting user's vendor
        if hasattr(obj, 'vendor'):
            return obj.vendor == vendor
        return False


class IsVendor(permissions.BasePermission):
    """
    Checks if the user has a vendor profile (regardless of approval status).
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return hasattr(request.user, 'vendor_profile')
