from django.core.mail import send_mail
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # checks if the email exists
    if reset_password_token == None:
        return

    email_plaintext_message = "A password change has been requested for your account. If you did not request this change, ignore this message. Click on the link to reset your password:\n" 
    email_plaintext_message += " " + "{}{}".format(instance.request.build_absolute_uri("http://127.0.0.1:3000/reset-password/"), reset_password_token.key)

    send_mail(
        "Password Reset for {title}".format(title="Crediation portal account"),
        email_plaintext_message,
        "info@yourcompany.com",
        [reset_password_token.user.email],
        fail_silently=False,
    )