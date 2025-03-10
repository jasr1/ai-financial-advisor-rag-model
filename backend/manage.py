#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rag_model.settings")

    if "CODESPACE_NAME" in os.environ and "GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN" in os.environ:
        codespace_url = f"https://{os.environ['CODESPACE_NAME']}-8000.{os.environ['GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN']}/api/query/?query=Your-Query-Here"
        print("\nSince this is GitHub Codespaces, change the visibility of the port to public and use the URL below to query.")
        print(f"Django is running at: {codespace_url}")
        print("Be sure to replace 'Your-Query-Here' with the appropriate query.\n")

    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
