from django.db import models
class PartnerEnquiry(models.Model):
    name=models.CharField(max_length=160); business_name=models.CharField(max_length=180); email=models.EmailField(); phone=models.CharField(max_length=25); message=models.TextField(blank=True); created_at=models.DateTimeField(auto_now_add=True); reviewed=models.BooleanField(default=False)
    def __str__(self): return self.business_name
