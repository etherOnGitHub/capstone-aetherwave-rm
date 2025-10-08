from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Preset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="presets")
    name = models.CharField(max_length=50)
    volume = models.FloatField()
    attack = models.FloatField()
    decay = models.FloatField()
    sustain = models.FloatField()
    release = models.FloatField()
    waveType = models.CharField(max_length=20, default="default")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Preset: {self.name} - Created By: {self.user.username}"