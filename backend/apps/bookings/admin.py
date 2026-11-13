from django.contrib import admin
from .models import Booking
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin): list_display=("id","user","hotel","check_in","check_out","status"); list_filter=("status",)
