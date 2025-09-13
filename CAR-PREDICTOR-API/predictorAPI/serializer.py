from rest_framework import serializers
from .models import User
from dj_rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update(
            {
                "first_name": self.validated_data.get("first_name", ""),
                "last_name": self.validated_data.get("last_name", ""),
            }
        )
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "date_joined",
            "last_login",
            "is_active",
        ]
