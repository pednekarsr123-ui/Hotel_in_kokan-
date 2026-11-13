from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import PartnerEnquiry
from .serializers import PartnerEnquirySerializer
class PartnerEnquiryViewSet(viewsets.ModelViewSet):
    queryset=PartnerEnquiry.objects.all().order_by("-created_at"); serializer_class=PartnerEnquirySerializer
    def get_permissions(self): return [AllowAny()] if self.request.method=="POST" else [IsAdminUser()]
