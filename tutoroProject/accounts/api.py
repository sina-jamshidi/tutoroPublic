from rest_framework import generics, permissions, status
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_text
from rest_framework.response import Response
from knox.models import AuthToken
from knox.auth import TokenAuthentication
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, \
    EmailVerificationSerializer, ChangePasswordSerializer
from .tokens import account_activation_token
from .models import EmailVerification, send_verification_email

# Register API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            # "token": AuthToken.objects.create(user)[1]
        })

class VerifyEmailAPI(generics.GenericAPIView):
    serializer_class = EmailVerificationSerializer

    def post(self, request, *args, **kwargs):
        uuid = force_text(urlsafe_base64_decode(self.kwargs['uidb64']))
        token = self.kwargs['token']
        email_obj = EmailVerification.objects.get(user=uuid)
        if email_obj:
            user = User.objects.get(id=uuid)
            if account_activation_token.check_token(user, token):
                serializer = self.get_serializer(email_obj, data={'email_verified':True}, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()        
        return Response ({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]           
        })

# Resend email verification email
class ResendEmailAPI(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        try:
            email_address = request.data['email']
            user = User.objects.get(email=email_address)
            email_obj = EmailVerification.objects.get(user=user.id)
            send_verification_email(EmailVerification, email_obj, True)
        except ObjectDoesNotExist:
            return Response({
                "error": "Email not found"
            })
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
        })

# Change password API
class ChangePasswordAPI(generics.GenericAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user
    
    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not self.object.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Incorrect password."]}, status=status.HTTP_400_BAD_REQUEST)        
        
        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()

        return Response({
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Password changed successfully',
            'data': []
        })


# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user