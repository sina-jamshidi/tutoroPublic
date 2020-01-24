from django.db import models
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.db.models.signals import post_save
from .tokens import account_activation_token

# Create your models here.
class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return "%s - %s" % (self.user.username, self.email_verified)

def send_verification_email(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        email_address = user.email
        first_name = user.first_name
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)
        url = "http://127.0.0.1:8000/#/api/verify/{}/{}".format(uid, token)

        html_message = "<h3>Hi %s</h3><p> In order to finalize your Tutoro registration, /\
            please click the following link to confirm your email.<a href='%s'>Email Confirmation/\
            </a><br><p><b>Thank your for joining Tutoro!</b></p><br>" % (first_name, url)
        
        send_mail(
            'Tutoro Verification',
            "Please go to " + url + " to verify your email.",
            'admin@tutoro.app',
            [email_address],
            fail_silently=False,
            html_message=html_message,
        )
        

post_save.connect(send_verification_email, sender=EmailVerification)