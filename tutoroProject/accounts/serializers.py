from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from .models import EmailVerification
from .tokens import account_activation_token

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name')

# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], 
            validated_data['password'], first_name=validated_data['first_name'])
        EmailVerification.objects.create(user=user, email_verified=False)
        return user

# Email Verification Serializer
class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailVerification
        fields = ('user', 'email_verified')

# Login serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        user_obj = EmailVerification.objects.get(user=user)
        verified = user_obj.email_verified
        if user and user.is_active:
            if verified:
                return user
            raise serializers.ValidationError("Email not verified")
        raise serializers.ValidationError("Incorrect Credentials")

class ChangePasswordSerializer(serializers.Serializer):
    model = User
    old_password = serializers.CharField()
    new_password = serializers.CharField()