from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Profile

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['user_role'] = user.profile.user_role
        
        return token
    
class ProfileSerializer(serializers.ModelSerializer):
    # Define the user_role field with choices
    user_role = serializers.ChoiceField(choices=Profile.USER_ROLE_CHOICES)

    class Meta:
        model = Profile
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')
        extra_kwargs = {'password': {'write_only': True}}  
    
    def create(self, validated_data):
        # Hash the password before saving it
        validated_data['password'] = make_password(validated_data['password'])
        user = super(UserSerializer, self).create(validated_data)
        return user