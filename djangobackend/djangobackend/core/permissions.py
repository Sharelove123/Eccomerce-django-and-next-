from rest_framework import permissions

class IsSuperUser(permissions.BasePermission):
    """
    Custom permission to allow only superusers.
    """
    def has_permission(self, request, view):
        print(request.user)
        return request.user and request.user.is_superuser