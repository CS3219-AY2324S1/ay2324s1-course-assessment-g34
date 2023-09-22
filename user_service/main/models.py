from django.contrib.auth.models import User
from django.db import models

class Profile(models.Model):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True) 
    displayed_name = models.CharField(max_length=60)

    def __str__(self):
        return f"{self.displayed_name}"