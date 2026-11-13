
import os

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create or update the hotel owner account"

    def handle(self, *args, **options):
        username = os.getenv("OWNER_USERNAME")
        email = os.getenv("OWNER_EMAIL")
        password = os.getenv("OWNER_PASSWORD")

        if not all([username, email, password]):
            raise CommandError("Owner environment variables are missing.")

        User = get_user_model()

        if User.objects.filter(email=email).exclude(username=username).exists():
            raise CommandError("Owner email is already used by another account.")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email}
        )

        user.email = email
        user.is_staff = True
        user.is_active = True
        user.set_password(password)
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS("Owner account created."))
        else:
            self.stdout.write(self.style.SUCCESS("Owner account updated."))
