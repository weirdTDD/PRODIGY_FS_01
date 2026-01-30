from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["id", "email", "username"]


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserModel
        fields = ["id", "email", "username", "password", "confirm_password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = UserModel.objects.create_user(
            email=validated_data["email"],
            username=validated_data.get("username"),
            password=validated_data["password"],
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        # keep it minimal; don't leak policy details if you don't want to
        if len(attrs.get("password", "")) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters"})
        return attrs
