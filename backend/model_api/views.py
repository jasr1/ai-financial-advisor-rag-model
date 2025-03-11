from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from model_api.model import query_google_gemini

@csrf_exempt
def ai_query(request):
    """Handles GET requests for AI queries."""
    user_query = request.GET.get("query", "No query provided.")
    if not user_query:
        return JsonResponse({"error": "No query provided"}, status=400)

    response = query_google_gemini(user_query)
    return JsonResponse({"response": response})

from django.views.decorators.http import require_POST
from .forms import UploadedFilesForm
from .models import Document

@csrf_exempt
@require_POST
def file_upload(request):
    form = UploadedFilesForm(request.POST, request.FILES)
    if form.is_valid():
        doc = Document()
        doc.file_name = form.cleaned_data['file'].name
        doc.file_path = form.cleaned_data['file']
        doc.save()
        return JsonResponse({"message": "File uploaded successfully."}, status=201)

    return JsonResponse({"error": form.errors}, status=400)

