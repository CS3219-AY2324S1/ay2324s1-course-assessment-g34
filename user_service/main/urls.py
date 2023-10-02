from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework_simplejwt.views import TokenVerifyView  

from .views import LoginViewSet, RegisterViewSet, UserViewSet

urlpatterns = [
    path('getUsers', UserViewSet.as_view({
        'get': 'list'
    })),
    path('register', RegisterViewSet.as_view({
        'post': 'register'
    })),
    path('getUser/<str:pk>', UserViewSet.as_view({
        'get': 'get',
    })),
    path('updateUser/<str:pk>', UserViewSet.as_view({
        'put': 'partial_update',
    })),
    path('deleteUser/<str:pk>', UserViewSet.as_view({
        'delete': 'delete'
    })),
    path('login', LoginViewSet.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
]