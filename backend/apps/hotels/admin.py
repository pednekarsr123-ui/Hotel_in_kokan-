
from django.contrib import admin
from .models import Hotel, Room


class RoomInline(admin.StackedInline):
    model = Room
    extra = 1
    fields = (
        "name",
        "description",
        "price_per_night",
        "max_guests",
        "image_url",
        "amenities",
        "is_active"
    )


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "location",
        "price_per_night",
        "is_featured",
        "is_active"
    )
    list_filter = ("is_active", "is_featured")
    search_fields = ("name", "location")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [RoomInline]


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "hotel",
        "price_per_night",
        "max_guests",
        "is_active"
    )
    list_filter = ("is_active", "hotel")
    search_fields = ("name", "hotel__name")
