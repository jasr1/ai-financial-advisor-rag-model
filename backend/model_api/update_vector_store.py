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
import json
from model_api.model_status import ModelStatus

env_path = Path(__file__).resolve().parents[2] / ".env.local"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GOOGLE_API_KEY")
if api_key is None:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
os.environ["GOOGLE_API_KEY"] = api_key


def combine_documents_to_markdown(pdf_dir):
    try:
        pdf_paths = [
            os.path.join(pdf_dir, file)
            for file in os.listdir(pdf_dir)
            if file.endswith(".pdf")
        ]
        if not pdf_paths:
            raise FileNotFoundError("There are no pdf files in this directory.")
        if None in pdf_paths:
            raise TypeError("There is a None type object in the list.")
        documents = [pymupdf4llm.to_markdown(pdf) for pdf in pdf_paths]
        return "\n\n".join(documents)
    except Exception as e:
        print(f"An error occured when attempting to combine documents to markdown: {e}")


def split_markdown(markdown, vector_store_dir):
    try:
        header_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=[
                ("#", "H1"),
                ("##", "H2"),
                ("###", "H3"),
                ("####", "H4"),
                ("#####", "H5"),
                ("######", "H6"),
                ("#######", "H7"),
                ("########", "H8"),
            ]
        )
        sections = header_splitter.split_text(markdown)
        sections_text = [doc.page_content for doc in sections]

        text_splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=200)
        list_of_chunks = [
            chunk
            for section in sections_text
            for chunk in text_splitter.split_text(section)
        ]

        chunk_metadata_dictionary = {}
        for i, chunk in enumerate(list_of_chunks):
            chunk_metadata_dictionary[i] = chunk

        os.makedirs(vector_store_dir, exist_ok=True)
        chunk_metadata_file_path = os.path.join(vector_store_dir, "metadata.json")

        # if os.path.exists(chunk_metadata_file_path):
        #     overwrite = (
        #         input(
        #             f"The file '{chunk_metadata_file_path}' already exists. Overwrite? (yes/no): "
        #         )
        #         .strip()
        #         .lower()
        #     )
        #     if overwrite != "yes":
        #         raise Exception("The process has been aborted by the user.")

        with open(chunk_metadata_file_path, "w") as outfile:
            json.dump(chunk_metadata_dictionary, outfile, indent=4)

        return list_of_chunks

    except Exception as e:
        print(f"An error occured when attempting to split the markdown text: {e}")


def generate_embeddings(markdown_chunks, batch_size=100, wait_time=60):
    try:
        client = genai.Client()
        all_embeddings = []

        num_batches = math.ceil(len(markdown_chunks) / batch_size)
        print(
            f"Number of batches: {num_batches}. Embedding will take approximately {num_batches} minutes due to rate limits imposed by the Google API."
        )

        model_status = ModelStatus.get_instance()
        model_status.set_time_estimate(num_batches)

        currentBatch = 1

        for batch_num, i in enumerate(
            range(0, len(markdown_chunks), batch_size), start=1
        ):
            print(f"Now embedding Batch {currentBatch}.")
            batch = markdown_chunks[i : i + batch_size]

            result = client.models.embed_content(
                model="text-embedding-004",
                contents=batch,
                config=types.EmbedContentConfig(output_dimensionality=768),
            )

            batch_embeddings = [embedding.values for embedding in result.embeddings]
            all_embeddings.extend(batch_embeddings)

            currentBatch += 1

            if batch_num < num_batches:
                print(f"Waiting {wait_time} seconds to embed next batch.")
                time.sleep(wait_time)
        print("Embeddings generated.")
        return all_embeddings
    except Exception as e:
        print(f"An error occured when attempting to generate embeddings: {e}")


def store_embeddings_in_FAISS(embeddings, vector_store_dir):
    try:

        os.makedirs(vector_store_dir, exist_ok=True)
        faiss_file_path = os.path.join(vector_store_dir, "faiss_index.bin")

        # if os.path.exists(faiss_file_path):
        #     overwrite = (
        #         input(
        #             f"The file '{faiss_file_path}' already exists. Overwrite? (yes/no): "
        #         )
        #         .strip()
        #         .lower()
        #     )
        #     if overwrite != "yes":
        #         raise Exception("The process has been aborted by the user.")

        embeddings_np = np.array(embeddings, dtype=np.float32)

        if len(embeddings_np) == 0:
            raise Exception("There are no embeddings.")

        embedding_dim = embeddings_np.shape[1]
        index = faiss.IndexFlatL2(embedding_dim)
        index.add(embeddings_np)

        faiss.write_index(index, faiss_file_path)
        
        model_status = ModelStatus.get_instance()
        model_status.set_time_estimate(0)
        model_status.set_model_status('ready')

        print("Embeddings stored in FAISS.")
    except Exception as e:
        print(f"An error occured when attempting to store embeddings: {e}")
        raise


def update_vector_store(pdf_dir, vector_store_dir):
    try:
        markdown_text = combine_documents_to_markdown(pdf_dir)
        splitted_markdown = split_markdown(markdown_text, vector_store_dir)
        embeddings = generate_embeddings(splitted_markdown)
        if not embeddings:
            raise Exception("There are no embeddings")
        store_embeddings_in_FAISS(embeddings, vector_store_dir)
    except Exception as e:
        print(f"An error occured: {e}")


if __name__ == "__main__":
    pdf_dir = "documents/"
    vector_store_dir = "vector_store/"
    update_vector_store(pdf_dir, vector_store_dir)
