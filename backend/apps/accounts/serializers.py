import re

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers

User = get_user_model()
SQL_INJECTION_PATTERN = re.compile(
    r"(?i)(?:--|/\*|\*/|;|\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\btruncate\b|\bexec\b|\bscript\b|\bor\b\s+1\s*=\s*1)"
)


def reject_sql_injection(value, field_name):
    if value is None:
        return value
    if isinstance(value, str) and SQL_INJECTION_PATTERN.search(value):
        raise ValidationError(f"Invalid {field_name} value.")
    return value


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        min_length=3,
        max_length=30,
        trim_whitespace=True,
    )
    email = serializers.EmailField()
    phone_number = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=20,
    )
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "username", "email", "phone_number", "password"]

    def validate_username(self, value):
        normalized = value.strip()
        reject_sql_injection(normalized, "username")
        if not re.fullmatch(r"[A-Za-z0-9_.-]+", normalized):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, underscores, dots, and hyphens."
            )
        return normalized

    def validate_email(self, value):
        normalized = value.strip().lower()
        reject_sql_injection(normalized, "email")
        return normalized

    def validate_phone_number(self, value):
        if not value:
            return ""
        normalized = value.strip()
        reject_sql_injection(normalized, "phone_number")
        if not re.fullmatch(r"\+?[0-9\s\-()]{8,20}", normalized):
            raise ValidationError("Enter a valid phone number using digits and optional +, spaces, hyphens, or parentheses.")
        return normalized

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)
