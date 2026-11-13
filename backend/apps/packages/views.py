from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import TourPackage
from .serializers import TourPackageSerializer
class TourPackageViewSet(viewsets.ModelViewSet):
    queryset=TourPackage.objects.all().order_by("-id")
    serializer_class=TourPackageSerializer
    def get_permissions(self):
        if self.request.method in ("GET","HEAD","OPTIONS"): return [AllowAny()]
        return [IsAdminUser()]
    def get_queryset(self):
        qs=super().get_queryset()
        if not self.request.user.is_staff: qs=qs.filter(is_active=True) if hasattr(TourPackage,"is_active") else qs.filter(is_published=True)
        return qs
