from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .serializers import ProfileSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def _get_profile(self, user):
        user_data = UserSerializer(user).data
        
        # Check if the user has a profile
        if hasattr(user, 'profile'):
            user_data['profile'] = {
                'displayed_name': user.profile.displayed_name,
                'user_role': user.profile.user_role
            }
        else:
            user_data['profile'] = None
        
        return user_data
    
    def list(self, request):
        users = User.objects.select_related('profile').all()
        serialized_data = []
        for user in users:
            user_data = self._get_profile(user)
            serialized_data.append(user_data)

        return Response(serialized_data, status=status.HTTP_200_OK)
    
    def login(self, request):
        # Perform user authentication here (e.g., username and password validation)
        # If authentication is successful, generate a token

        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.get(username=username)

        if check_password(password, user.password):
            # Authentication successful
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            return Response({'access_token': access_token, 'refresh_token': refresh_token}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        
    def register(self, request):
        user_serializer = UserSerializer(data=request.data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            
            profile_data = {
                'user_id': user.id,
                'displayed_name': request.data.get('displayed_name', user.username),
                'user_role': 'normal user'
            }
            
            profile_serializer = ProfileSerializer(data=profile_data)
            
            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
            else:
                user.delete()  # Rollback user creation if profile creation fails
                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk=None):
        user = User.objects.get(username=pk)
        user_data = self._get_profile(user)

        return Response(user_data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        try:
            user = User.objects.get(username=pk)
            profile = user.profile

            # Update the profile fields based on the request data
            serializer = ProfileSerializer(profile, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self, request, pk=None):
        user = User.objects.get(username=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)