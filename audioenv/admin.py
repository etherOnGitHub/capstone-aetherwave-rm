from django.contrib import admin
from .models import Preset

@admin.register(Preset)
class PresetAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at")
    search_fields = ("name", "user__username")
    list_filter = ("created_at",)