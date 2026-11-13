from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Hotel
from .serializers import HotelSerializer
class HotelViewSet(viewsets.ModelViewSet):
    queryset=Hotel.objects.all().order_by("-id")
    serializer_class=HotelSerializer
    def get_permissions(self):
        if self.request.method in ("GET","HEAD","OPTIONS"): return [AllowAny()]
        return [IsAdminUser()]
    def get_queryset(self):
        qs=super().get_queryset()
        if not self.request.user.is_staff: qs=qs.filter(is_active=True) if hasattr(Hotel,"is_active") else qs.filter(is_published=True)
        return qs
