from django.test import TestCase

from apps.accounts.models import User


class RegistrationSecurityTests(TestCase):
    def test_phone_number_must_follow_expected_format(self):
        from apps.accounts.serializers import RegisterSerializer

        payload = {
            "username": "newuser123",
            "email": "newuser@example.com",
            "phone_number": "abc123",
            "password": "StrongPassword123!",
        }

        serializer = RegisterSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertIn("phone_number", serializer.errors)

    def test_sql_injection_payload_is_rejected(self):
        from apps.accounts.serializers import RegisterSerializer

        payload = {
            "username": "admin' OR '1'='1",
            "email": "sqltest@example.com",
            "phone_number": "+91 9876543210",
            "password": "StrongPassword123!",
        }

        serializer = RegisterSerializer(data=payload)

        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_new_passwords_use_secure_hashing(self):
        user = User.objects.create_user(
            username="bcryptuser",
            email="bcryptuser@example.com",
            password="VeryStrongPassword123!",
        )

        self.assertTrue(user.password.startswith("bcrypt_sha256$"))
        self.assertNotEqual(user.password, "VeryStrongPassword123!")
        self.assertNotIn("VeryStrongPassword123!", user.password)
