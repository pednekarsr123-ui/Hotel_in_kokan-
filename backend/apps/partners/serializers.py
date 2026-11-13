from rest_framework import serializers
from .models import PartnerEnquiry
class PartnerEnquirySerializer(serializers.ModelSerializer):
    class Meta: model=PartnerEnquiry; fields=["id","name","business_name","email","phone","message","created_at","reviewed"]; read_only_fields=["id","created_at","reviewed"]
