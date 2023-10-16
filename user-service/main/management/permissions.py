from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners or admin to edit/delete an object.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Allow GET requests (read-only) for all auth users
        if request.method == 'GET':
            return True
        
        # Allow admin users to perform any action
        if request.user.is_superuser:
            return True

        # Check if the user is the owner of the object being accessed
        return request.user.username == view.kwargs.get('pk')
