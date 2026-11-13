
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action in [
            "update",
            "partial_update",
            "destroy",
            "confirm",
            "cancel"
        ]:
            return [IsAdminUser()]

        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Booking.objects.select_related(
            "hotel",
            "room",
            "user"
        ).order_by("-created_at")

        if self.request.user.is_staff:
            return qs

        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        booking = self.get_object()

        if booking.status != "pending":
            return Response(
                {"detail": "Only pending bookings can be confirmed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "confirmed"
        booking.save(update_fields=["status"])

        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status != "pending":
            return Response(
                {"detail": "Only pending bookings can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = "cancelled"
        booking.save(update_fields=["status"])

        return Response(BookingSerializer(booking).data)
