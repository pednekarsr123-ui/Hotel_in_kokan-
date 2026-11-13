from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Activity
from .serializers import ActivitySerializer
class ActivityViewSet(viewsets.ModelViewSet):
    queryset=Activity.objects.all().order_by("-id")
    serializer_class=ActivitySerializer
    def get_permissions(self):
        if self.request.method in ("GET","HEAD","OPTIONS"): return [AllowAny()]
        return [IsAdminUser()]
    def get_queryset(self):
        qs=super().get_queryset()
        if not self.request.user.is_staff: qs=qs.filter(is_active=True) if hasattr(Activity,"is_active") else qs.filter(is_published=True)
        return qs
