from django.urls import path, include, re_path
from .api import RegisterAPI, LoginAPI, VerifyEmailAPI, ResendEmailAPI, ChangePasswordAPI
from knox import views as knox_views
from rest_auth import views as rest_auth_views

urlpatterns = [
    path('/auth', include('knox.urls')),
    path('/auth/register', RegisterAPI.as_view()),
    path('/auth/login', LoginAPI.as_view()),
    # path('/auth/user', UserAPI.as_view()),
    path('/auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('/auth/', include('rest_auth.urls')),
    path('/auth/password/change', ChangePasswordAPI.as_view(), name='change_password'),
    path('/auth/password/reset/confirm/<uidb64>/<token>/', \
        rest_auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    re_path \
        (r'^/verify/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})$',
        VerifyEmailAPI.as_view(), name='verify_email'),
]