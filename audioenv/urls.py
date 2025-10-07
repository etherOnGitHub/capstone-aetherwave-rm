from . import views
from django.urls import path
from django.views.generic import TemplateView
from .views import PresetListCreateView
from .views import PresetListCreateView, PresetDetailView, auth_status

urlpatterns = [
    path("api/auth-status/", auth_status, name="auth_status"),
    path("", TemplateView.as_view(template_name="base.html"), name="home"),
    path('api/presets/', PresetListCreateView.as_view(), name="preset-list"),
    path("api/presets/<int:pk>/", PresetDetailView.as_view(), name="preset-detail"),
]
