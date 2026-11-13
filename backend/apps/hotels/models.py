
from django.db import models


class Hotel(models.Model):
    name = models.CharField(max_length=180)
    slug = models.SlugField(unique=True)
    location = models.CharField(max_length=180)
    description = models.TextField()
    address = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        default=None
    )
    image_url = models.URLField(blank=True)
    amenities = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Room(models.Model):
    hotel = models.ForeignKey(
        Hotel,
        on_delete=models.CASCADE,
        related_name="rooms"
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    max_guests = models.PositiveSmallIntegerField(default=2)
    image_url = models.URLField(blank=True)
    amenities = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["price_per_night", "name"]

    def __str__(self):
        return f"{self.hotel.name} - {self.name}"
