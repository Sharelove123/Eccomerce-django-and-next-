from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer

from .models import User

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'avatar_url'
        )

class CustomLoginSerializer(LoginSerializer):
    username = None