# This file is used to create and update the vector store. Any time you add new pdf files to the 'books' directory, you will need to run this script to update the vector store.

import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from pathlib2 import Path

# Construct the path to the .env file in the main directory
env_path = Path(__file__).resolve().parents[3] / '.env.local'

# Load environment variables from .env.local
load_dotenv(dotenv_path=env_path)

# Get the API key from the environment
api_key = os.getenv("OPENAI_API_KEY")
if api_key is None:
    raise ValueError("OPENAI_API_KEY not found in environment variables")
os.environ["OPENAI_API_KEY"] = api_key

def update_vector_store(pdf_dir, vector_store_dir):
    try:
        # Check if the vector store directory already contains files. Allow the user to overwrite them if they want.
        if os.path.exists(vector_store_dir) and os.listdir(vector_store_dir):
            overwrite = input(f"The directory '{vector_store_dir}' already contains files. Do you want to overwrite them? (yes/no): ").strip().lower()
            if overwrite != 'yes':
                print("Update aborted by the user.")
                return

        # Loading the PDF files from the directory, combining them into a single document, and then splitting the text into chunks.
        pdf_paths = [os.path.join(pdf_dir, file) for file in os.listdir(pdf_dir) if file.endswith('.pdf')]
        if not pdf_paths:
            print("No PDF files found in the specified directory.")
            return

        documents = []
        for pdf_path in pdf_paths:
            loader = PyPDFLoader(file_path=pdf_path)
            documents.extend(loader.load())

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        split_documents = text_splitter.split_documents(documents)

        # Generating the embeddings for the split documents and creating a FAISS vector store from them.
        embeddings = OpenAIEmbeddings()
        vector_store = FAISS.from_documents(split_documents, embedding=embeddings)

        # Saving the vector store
        vector_store.save_local(vector_store_dir)
        print("Vector store updated and saved successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    pdf_dir = "documents/"
    vector_store_dir = "vector_store/"

    update_vector_store(pdf_dir, vector_store_dir)
