from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
        ]


# Registration Serializer
class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128, min_length=8, write_only=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ["email", "username", "first_name", "last_name", "password"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if email and password:
            user = authenticate(
                request=self.context.get("request"), username=email, password=password
            )

            if not user:
                msg = "Unable to log in with provided credentials."
                raise serializers.ValidationError(msg, code="authorization")
        else:
            msg = "Must include 'email' and 'password'."
            raise serializers.ValidationError(msg, code="authorization")

        data["user"] = user
        return data
