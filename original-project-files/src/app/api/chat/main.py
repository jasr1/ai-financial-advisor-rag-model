import sys
print("Using Python interpreter at:", sys.executable)
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import json
import logging
logging.basicConfig(level=logging.DEBUG)

# Add the parent directory to the system path to import model
sys.path.append(str(Path(__file__).resolve().parents[2] / 'model'))
from model import process_message  # Import process_message from model.py

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": "http://localhost:3000",  # Adjust this as necessary
    "methods": ["GET", "POST"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

@app.route('/api/chat/send_message', methods=['POST'])
def chat():
    app.logger.debug("Received request for /api/chat/send_message")

    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        app.logger.error("No message provided in the request")
        return jsonify({"error": "No message provided"}), 400
    
    response_message = process_message(user_message)
    
    app.logger.debug("Processed message: %s", response_message)

    return jsonify({"answer": response_message})

@app.route('/api/chat/submit_responses', methods=['POST'])
def submit_responses():
    data = request.json
    responses = data.get('responses', {})

    with open('responses.json', 'w') as file:
        json.dump(responses, file)
    
    return jsonify({"status": "Success", "message": "Data saved successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)