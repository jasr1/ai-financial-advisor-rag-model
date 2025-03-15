import os
from django.core.management.base import BaseCommand
from model_api.models import Document
from django.conf import settings

class Command(BaseCommand):
    help = "Removes database entries for missing files in the documents folder."

    def handle(self, *args, **kwargs):
        base_dir = settings.BASE_DIR
        documents_folder = os.path.join(base_dir, "model_api", "documents")
        deleted_count = 0

        for doc in Document.objects.all():
            file_path = os.path.join(documents_folder, doc.file_path.name)

            if not os.path.exists(file_path):
                self.stdout.write(f"Deleting missing file entry: {doc.file_name}")
                doc.delete()
                deleted_count += 1

        self.stdout.write(self.style.SUCCESS(f"Cleanup complete. {deleted_count} orphaned records deleted."))
