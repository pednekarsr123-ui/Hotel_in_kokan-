from django.contrib import admin
from .models import PartnerEnquiry
@admin.register(PartnerEnquiry)
class PartnerEnquiryAdmin(admin.ModelAdmin): list_display=("business_name","name","email","created_at","reviewed"); list_filter=("reviewed",)
