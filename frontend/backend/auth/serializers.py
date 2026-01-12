from rest_framework import serializers
from models import *
from django.contrib.auth import get_user_model
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password =serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }
