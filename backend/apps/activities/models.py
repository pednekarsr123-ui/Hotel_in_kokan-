from django.db import models

class Activity(models.Model):
    name=models.CharField(max_length=180); location=models.CharField(max_length=180); description=models.TextField(); price_from=models.DecimalField(max_digits=10,decimal_places=2,default=0); image_url=models.URLField(blank=True); is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name if hasattr(self,"name") else self.title
