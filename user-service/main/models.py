from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    USER_ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('normal user', 'Normal User'),
    ]

    user_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True) 
    displayed_name = models.CharField(max_length=60)
    user_role = models.CharField(max_length=20, choices=USER_ROLE_CHOICES, default='normal user')

    def __str__(self):
        return f"{self.displayed_name}"