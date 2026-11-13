from rest_framework import serializers
from .models import TourPackage
class TourPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model=TourPackage; fields="__all__"
