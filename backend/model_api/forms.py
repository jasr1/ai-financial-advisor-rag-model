from django import forms
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

MAX_FILE_SIZE = 10 * 1024 * 1024

class UploadedFilesForm(forms.Form):
    file = forms.FileField(validators=[FileExtensionValidator(['pdf'])])

    def clean_file(self):
        data = self.cleaned_data["file"]
        accepted_mime_type = "application/pdf"

        if not data.content_type or data.content_type != accepted_mime_type:
            raise ValidationError("Unsupported file type.")
        
        if data.size > MAX_FILE_SIZE:
            raise ValidationError("File size exceeds 10MB limit.")

        return data

        

