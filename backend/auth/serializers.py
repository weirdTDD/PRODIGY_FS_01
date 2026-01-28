from rest_framework import serializers
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


def validate(self, attrs):
    if attrs["password"] != attrs["confirm_password"]:
        raise serializers.ValidationError("Passwords do not match")
    return attrs


def create(self, validated_data):
    validated_data.pop("confirm_password")

    user= User.objects.create_user(
        email= validated_data["email"],
        password= validated_data["password"],
        username= validated_data["username"]
    ) 
    
    return user