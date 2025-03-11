from django.db import models

# Create your models here.
class Document(models.Model):
    class Status(models.IntegerChoices):
        PEN = 1, "Pending"
        PCD = 2, "Processed"
    file_name = models.CharField(max_length=255)
    upload_time = models.DateField(auto_now_add=True)
    file_path = models.FileField(upload_to="")
    status = models.PositiveSmallIntegerField(
        choices = Status.choices,
        default = Status.PEN
    )