from rest_framework import generics
from .models import Preset
from .serializers import PresetSerializer

class PresetListCreateView(generics.ListCreateAPIView):
    queryset = Preset.objects.all()
    serializer_class = PresetSerializer