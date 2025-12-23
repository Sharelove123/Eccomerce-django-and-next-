from rest_framework import permissions

class IsModelUser(permissions.BasePermission):

    def has_permission(self, request, view):
       
        if request.method == 'POST': 
            return True
        
        model_instance = self.get_model_instance(view, request)
        
        if model_instance and request.user.id == model_instance.user.id:
            return True
        
        return False

    def get_model_instance(self, view, request):
        """
        Utility method to get the model instance based on the URL parameters.
        """
        if hasattr(view, 'get_object'):
            return view.get_object()  # If the view has a `get_object` method, we can call it to retrieve the instance.
        return None
