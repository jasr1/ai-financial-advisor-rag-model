from django.urls import path
from .views import ai_query, file_upload

urlpatterns = [
    path('query/', ai_query, name='ai_query'),
    path('file-upload/', file_upload, name='file_upload')
]
