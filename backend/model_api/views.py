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
