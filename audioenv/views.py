from django.http import JsonResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Preset
from .serializers import PresetSerializer

class PresetListCreateView(generics.ListCreateAPIView):
    serializer_class = PresetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return presets that belong to the logged-in user
        return Preset.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically set the preset's user to the logged-in user
        serializer.save(user=self.request.user)


@api_view(['GET'])
def auth_status(request):
    return JsonResponse({
        "authenticated": request.user.is_authenticated,
        "username": request.user.username if request.user.is_authenticated else None
    })