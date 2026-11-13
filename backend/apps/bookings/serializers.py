
from datetime import date
from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(
        source="hotel.name",
        read_only=True
    )

    room_name = serializers.CharField(
        source="room.name",
        read_only=True,
        allow_null=True
    )

    customer_name = serializers.CharField(
        source="user.username",
        read_only=True
    )

    customer_email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    customer_phone = serializers.CharField(
        source="user.phone_number",
        read_only=True,
        allow_blank=True
    )

    class Meta:
        model = Booking
        fields = [
            "id",
            "hotel",
            "hotel_name",
            "room",
            "room_name",
            "customer_name",
            "customer_email",
            "customer_phone",
            "check_in",
            "check_out",
            "guests",
            "customer_note",
            "status",
            "created_at"
        ]
        read_only_fields = [
            "status",
            "created_at",
            "customer_name",
            "customer_email",
            "customer_phone"
        ]

    def validate(self, data):
        check_in = data.get("check_in")
        check_out = data.get("check_out")

        if check_in and check_out and check_out <= check_in:
            raise serializers.ValidationError(
                "Check-out must be after check-in."
            )

        if check_in and check_in < date.today():
            raise serializers.ValidationError(
                "Check-in cannot be in the past."
            )

        guests = data.get(
            "guests",
            self.instance.guests if self.instance else 1
        )

        if guests < 1:
            raise serializers.ValidationError(
                "At least one guest is required."
            )

        room = data.get(
            "room",
            self.instance.room if self.instance else None
        )

        hotel = data.get(
            "hotel",
            self.instance.hotel if self.instance else None
        )

        if room:
            if not room.is_active:
                raise serializers.ValidationError(
                    {"room": "This room is currently unavailable."}
                )

            if hotel and room.hotel_id != hotel.id:
                raise serializers.ValidationError(
                    {"room": "This room does not belong to the selected hotel."}
                )

            if guests > room.max_guests:
                raise serializers.ValidationError(
                    {"guests": f"This room allows a maximum of {room.max_guests} guests."}
                )

        return data
