from django.db import models

class BlogPost(models.Model):
    title=models.CharField(max_length=200); slug=models.SlugField(unique=True); excerpt=models.CharField(max_length=300,blank=True); content=models.TextField(); image_url=models.URLField(blank=True); published_at=models.DateTimeField(auto_now_add=True); is_published=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name if hasattr(self,"name") else self.title
