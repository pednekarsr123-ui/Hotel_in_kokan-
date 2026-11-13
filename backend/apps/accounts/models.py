from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_image = models.URLField(blank=True)
    def __str__(self): return self.email or self.username
