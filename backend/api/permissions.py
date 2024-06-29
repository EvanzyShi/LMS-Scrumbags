from rest_framework import permissions
from api.serializers import UserSerializer


class IsStaff(permissions.BasePermission):
    """
    Custom permission to only allow staff of an object to add or edit it.
    """

    def has_permission(self, request, view):
        serializer = UserSerializer(request.user)
        return serializer.data['is_staff']
    
class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow the creator of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        return obj.created_by_id == request.user.id