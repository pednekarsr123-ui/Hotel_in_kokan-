
from django.conf import settings
from django.db import models


class Booking(models.Model):
    STATUS = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled")
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    hotel = models.ForeignKey(
        "hotels.Hotel",
        on_delete=models.PROTECT,
        related_name="bookings"
    )

    room = models.ForeignKey(
        "hotels.Room",
        on_delete=models.PROTECT,
        related_name="bookings",
        null=True,
        blank=True
    )

    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveSmallIntegerField(default=1)
    customer_note = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS,
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.pk} - {self.user}"
