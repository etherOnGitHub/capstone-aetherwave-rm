from . import views
from django.urls import path
from django.views.generic import TemplateView
from .views import PresetListCreateView

urlpatterns = [
    path("", TemplateView.as_view(template_name="base.html"), name="home"),
    path('api/presets/', PresetListCreateView.as_view(), name="preset-list"),
]
