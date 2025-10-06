from django.http import JsonResponse
from rest_framework import generics
from .models import Preset
from .serializers import PresetSerializer

class PresetListCreateView(generics.ListCreateAPIView):
    queryset = Preset.objects.all()
    serializer_class = PresetSerializer


def auth_status(request):
    return JsonResponse({
        "authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None
    })
