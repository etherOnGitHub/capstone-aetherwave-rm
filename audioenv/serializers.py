from rest_framework import serializers
from .models import Preset

class PresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preset
        fields = [
            "id",
            "name",
            "volume",
            "attack",
            "decay",
            "sustain",
            "release",
            "waveType",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "user"]

        def perform_create(self, serializer):
            serializer.save(user=self.request.user)