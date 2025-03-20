from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from model_api.model import query_google_gemini, load_faiss_and_metadata

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


def view_files(request):
    documents = Document.objects.all()
    documents_dictionary = {'files':[]}
    for doc in documents:
        document_details = {
            "file_name": doc.file_name,
            "upload_time": doc.upload_time
        }
        documents_dictionary["files"].append(document_details)
    documents_dictionary["total_files"] = len(documents_dictionary["files"])
    return JsonResponse(documents_dictionary)

from django.conf import settings
import os

@csrf_exempt
@require_POST
def delete_file(request):

    deletion_request = request.POST.get("name", "No file name given.")
    if not deletion_request:
        return JsonResponse({"error": "No file name given."}, status=400)
    
    document = Document.objects.filter(file_name=deletion_request).first()
    if not document:
        return JsonResponse({"error": "File not found in database."}, status=404)

    base_dir = settings.BASE_DIR
    actual_filename = document.file_path.name
    file_path = os.path.join(base_dir, 'model_api/documents', actual_filename)
    does_file_exist = os.path.exists(file_path)
    
    if not does_file_exist:
        return JsonResponse({"error": "File does not exist."}, status=404)
    
    os.remove(file_path)
    document.delete()

    return JsonResponse({"message": "File deleted successfully"}, status=200)


from model_api.update_vector_store import update_vector_store
import threading

def run_model_update():
    base_dir = settings.BASE_DIR
    documents_path = os.path.join(base_dir, "model_api", "documents")
    vector_store_path = os.path.join(base_dir, "model_api", "vector_store")

    update_vector_store(documents_path, vector_store_path)
    global index, markdown_chunks
    index, markdown_chunks = load_faiss_and_metadata(vector_store_path)

def generate_model(request):
    thread = threading.Thread(target=run_model_update)
    thread.name = 'model-generation-thread'
    thread.start()

    return JsonResponse({"message": "Model generation started. Check back later."}, status=202)

from model_api.model_status import ModelStatus

def check_gen_status(request):
    model_status = ModelStatus.get_instance()
    for thread in threading.enumerate():
        if thread.name == "model-generation-thread":
            model_status.set_model_status("processing")
            break

    return JsonResponse({"message": model_status.get_model_status(), "time_estimate": model_status.get_time_estimate()}, status=200)