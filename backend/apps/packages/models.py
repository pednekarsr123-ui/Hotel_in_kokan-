from django.db import models

class TourPackage(models.Model):
    name=models.CharField(max_length=180); slug=models.SlugField(unique=True); duration=models.CharField(max_length=80); price=models.DecimalField(max_digits=10,decimal_places=2,default=0); description=models.TextField(); image_url=models.URLField(blank=True); is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name if hasattr(self,"name") else self.title
