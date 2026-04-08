from django.http import JsonResponse

from rest_framework.decorators import api_view, authentication_classes, permission_classes

from .models import User
from .serializers import UserDetailSerializer, UpdateUserProfileSerializer




@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def landlord_detail(request, pk):
    user = User.objects.get(pk=pk)

    serializer = UserDetailSerializer(user, many=False)

    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def update_profile(request):
    user = request.user
    
    # We allow partial update of name and avatar
    serializer = UpdateUserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse({'success': True, 'user': UserDetailSerializer(user).data})
    return JsonResponse(serializer.errors, status=400)

