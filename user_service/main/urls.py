from django.urls import path

from .views import UserViewSet

urlpatterns = [
    path('users', UserViewSet.as_view({
        'get': 'list'
    })),
    path('register', UserViewSet.as_view({
        'post': 'register'
    })),
    path('users/<str:pk>', UserViewSet.as_view({
        'get': 'get',
        'put': 'partial_update',
        'delete': 'delete'
    })),
]