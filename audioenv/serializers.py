from rest_framework import serializers
from .models import Preset

class PresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preset
        fields = '__all__'