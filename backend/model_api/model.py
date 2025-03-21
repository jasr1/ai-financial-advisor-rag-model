import os
from dotenv import load_dotenv
import faiss
import numpy as np
from google import genai
from google.genai import types
from pathlib import Path
import json

env_path = Path(__file__).resolve().parents[2] / ".env.local"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
os.environ["GOOGLE_API_KEY"] = api_key

base_directory = os.path.dirname(os.path.abspath(__file__))
pdf_dir = "documents/"
vector_store_path = os.path.join(base_directory, "vector_store")
metadata_file_path = os.path.join(vector_store_path, "metadata.json")



def get_chunks_from_metadata(metadata_file_path):
    with open(metadata_file_path, "r") as metadata_file:
        json_data = json.load(metadata_file)

    return list(json_data.values())

def load_faiss_and_metadata(vector_store_path):
    try:
        faiss_index_file = os.path.join(vector_store_path, "faiss_index.bin")
        metadata_file_path = os.path.join(vector_store_path, "metadata.json")

        if os.path.exists(faiss_index_file):
            new_index = faiss.read_index(faiss_index_file)
        else:
            raise FileNotFoundError("FAISS index file not found. Please generate the model first.")
        
        with open(metadata_file_path, "r") as metadata_file:
            json_data = json.load(metadata_file)
            new_markdown_chunks = list(json_data.values())

        return new_index, new_markdown_chunks
    
    except Exception as e:
        raise RuntimeError(f"Failed to load FAISS and metadata: {e}")

try:
    index, markdown_chunks = load_faiss_and_metadata(vector_store_path)
except Exception as e:
    print(f"Warning: {e}")
    index = None
    markdown_chunks = []

def generate_query_embedding(query):
    try:
        client = genai.Client()
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=[query],
            config=types.EmbedContentConfig(output_dimensionality=768),
        )
        return result.embeddings[0].values
    except Exception as e:
        return None


def search_faiss_for_relevant_text(query, top_k=8):
    global index, markdown_chunks

    try:
        index, markdown_chunks = load_faiss_and_metadata(vector_store_path)

    except Exception as e:
        return f"Error: Could not reload FAISS - {e}"
    
    query_embedding = generate_query_embedding(query)

    if query_embedding is None:
        return "Error: Failed to generate query embedding."

    try:
        query_np = np.array([query_embedding], dtype=np.float32)

        if index.ntotal == 0:
            return "Error: FAISS index is empty. Please update the vector store."

        if index.ntotal != len(markdown_chunks):
            return "Error: FAISS index is mismatched with stored text."

        distances, indices = index.search(query_np, top_k)

        retrieved_chunks = []
        for i in indices[0]:
            if 0 <= i < len(markdown_chunks):
                retrieved_chunks.append(markdown_chunks[i])

        if not retrieved_chunks:
            return "No relevant documents found for this query."

        return "\n\n".join(retrieved_chunks)

    except Exception as e:
        return "Error: Failed to retrieve relevant text."


def query_google_gemini(user_query):
    retrieved_text = search_faiss_for_relevant_text(user_query)

    if "Error" in retrieved_text:
        return retrieved_text

    try:
        client = genai.Client()
        prompt = f"Context: {retrieved_text}\n\nUser Question: {user_query}\n\nAnswer:"
        prompt += "Answer the question using the provided context only. Be accurate."

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=[prompt]
        )

        return response.text
    except Exception as e:
        return "Error: Failed to generate response from Gemini."


if __name__ == "__main__":
    while True:
        user_query = input("Ask a question (or type 'exit' to quit): ").strip()
        if user_query.lower() == "exit":
            break

        response = query_google_gemini(user_query)
        print("\nResponse:\n", response, "\n")
