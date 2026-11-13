
from rest_framework import serializers
from .models import Hotel, Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = [
            "id",
            "name",
            "description",
            "price_per_night",
            "max_guests",
            "image_url",
            "amenities"
        ]


class HotelSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = "__all__"

    def get_rooms(self, obj):
        active_rooms = obj.rooms.filter(is_active=True)
        return RoomSerializer(active_rooms, many=True).data
