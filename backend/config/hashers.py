from django.contrib.auth.hashers import Argon2PasswordHasher


class SecureArgon2PasswordHasher(Argon2PasswordHasher):
    time_cost = 3
    memory_cost = 102400
    parallelism = 8
    hash_len = 32
    salt_len = 16
