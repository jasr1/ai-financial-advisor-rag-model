import os
from dotenv import load_dotenv
import faiss
from pathlib import Path
import pymupdf4llm
from langchain.text_splitter import MarkdownTextSplitter, MarkdownHeaderTextSplitter
from google import genai
from google.genai import types
import numpy as np
import time
import math

env_path = Path(__file__).resolve().parents[3] / '.env.local'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
os.environ["GOOGLE_API_KEY"] = api_key

def combine_documents_to_markdown(pdf_dir):
    try:
        pdf_paths = [os.path.join(pdf_dir, file) for file in os.listdir(pdf_dir) if file.endswith('.pdf')]
        if not pdf_paths:
            return []

        documents = [pymupdf4llm.to_markdown(pdf) for pdf in pdf_paths]
        return "\n\n".join(documents)
    except Exception as e:
        return []

def split_markdown(markdown):
    try:
        header_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=[
            ("#", "H1"),  
            ("##", "H2"),  
            ("###", "H3"),  
            ("####", "H4"),  
            ("#####", "H5"),  
            ("######", "H6")
        ])
        sections = header_splitter.split_text(markdown)
        sections_text = [doc.page_content for doc in sections]

        text_splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=200)
        return [chunk for section in sections_text for chunk in text_splitter.split_text(section)]
    except Exception as e:
        return []

def generate_embeddings(markdown_chunks, batch_size=100, wait_time=60):
    try:
        client = genai.Client()
        all_embeddings = []

        num_batches = math.ceil(len(markdown_chunks) / batch_size)

        for batch_num, i in enumerate(range(0, len(markdown_chunks), batch_size), start=1):
            batch = markdown_chunks[i:i + batch_size]

            result = client.models.embed_content(
                model="text-embedding-004",
                contents=batch,
                config=types.EmbedContentConfig(output_dimensionality=768)
            )

            batch_embeddings = [embedding.values for embedding in result.embeddings]
            all_embeddings.extend(batch_embeddings)

            if batch_num < num_batches:
                time.sleep(wait_time)

        return all_embeddings
    except Exception as e:
        return []

def store_embeddings_in_FAISS(embeddings, vector_store_dir):
    try:
        os.makedirs(vector_store_dir, exist_ok=True)
        faiss_file_path = os.path.join(vector_store_dir, "faiss_index.bin")

        if os.path.exists(faiss_file_path):
            overwrite = input(f"The file '{faiss_file_path}' already exists. Overwrite? (yes/no): ").strip().lower()
            if overwrite != 'yes':
                return

        embeddings_np = np.array(embeddings, dtype=np.float32)

        if len(embeddings_np) == 0:
            return

        embedding_dim = embeddings_np.shape[1]
        index = faiss.IndexFlatL2(embedding_dim)
        index.add(embeddings_np)

        faiss.write_index(index, faiss_file_path)
        return index
    except Exception as e:
        return []

def update_vector_store(pdf_dir, vector_store_dir):
    markdown_text = combine_documents_to_markdown(pdf_dir)
    splitted_markdown = split_markdown(markdown_text)
    embeddings = generate_embeddings(splitted_markdown)
    store_embeddings_in_FAISS(embeddings, vector_store_dir)

if __name__ == "__main__":
    pdf_dir = "documents/"
    vector_store_dir = "vector_store/"
    update_vector_store(pdf_dir, vector_store_dir)
