
import json
import os
from pathlib import Path

from django.apps import apps
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError


EXPECTED_COUNTS = {
    "hotels.hotel": 2,
    "hotels.room": 9,
    "destinations.destination": 2,
    "packages.tourpackage": 3,
    "activities.activity": 3,
}


class Command(BaseCommand):
    help = "Safely restore the original hotel website content"

    def handle(self, *args, **options):
        if os.environ.get("RENDER_SERVICE_ID") is None:
            raise CommandError("This command can only run on Render.")

        if os.environ.get("RESTORE_CONTENT_ONCE") != "YES":
            raise CommandError("Restore confirmation is missing.")

        fixture = Path("backup_content.json")

        if not fixture.exists():
            raise CommandError("backup_content.json was not found.")

        with fixture.open(encoding="utf-8") as file:
            records = json.load(file)

        actual_counts = {}

        for item in records:
            model = item.get("model")
            actual_counts[model] = actual_counts.get(model, 0) + 1

        if actual_counts != EXPECTED_COUNTS:
            raise CommandError("Backup record counts do not match.")

        model_labels = {
            "hotels.hotel": ("hotels", "Hotel"),
            "hotels.room": ("hotels", "Room"),
            "destinations.destination": ("destinations", "Destination"),
            "packages.tourpackage": ("packages", "TourPackage"),
            "activities.activity": ("activities", "Activity"),
        }

        current_counts = {}

        for label, model_name in model_labels.items():
            model = apps.get_model(*model_name)
            current_counts[label] = model.objects.count()

        if current_counts == EXPECTED_COUNTS:
            self.stdout.write(
                self.style.SUCCESS("Original content is already restored.")
            )
            return

        if any(current_counts.values()):
            raise CommandError(
                "Some content records already exist. No records were imported."
            )

        call_command("loaddata", str(fixture))

        self.stdout.write(
            self.style.SUCCESS("All 19 original content records were restored.")
        )
