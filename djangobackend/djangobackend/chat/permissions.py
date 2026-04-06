from rest_framework import permissions


class IsChatParticipant(permissions.BasePermission):
    message = "You do not have access to this chat."

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        thread = getattr(obj, 'thread', obj)
        return (
            thread.customer_id == request.user.id or
            thread.vendor.user_id == request.user.id
        )
