from django.urls import path
from .views import ai_query, file_upload, view_files, delete_file

urlpatterns = [
    path('query/', ai_query, name='ai_query'),
    path('file-upload/', file_upload, name='file_upload'),
    path('file-list/', view_files, name='view_files'),
    path('delete-file/', delete_file, name='delete_file')
]
