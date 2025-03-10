# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import sys
# from pathlib import Path

# # Add the parent directory to the system path to import model
# sys.path.append(str(Path(__file__).resolve().parents[1] / 'model'))
# from model import process_message  # Import process_message from model.py

# app = Flask(__name__)
# CORS(app)  # This will enable CORS for all routes

# @app.route('/api/chat', methods=['POST'])
# def chat():
#     data = request.json
#     user_message = data.get('message', '')
    
#     if not user_message:
#         return jsonify({"error": "No message provided"}), 400
    
#     response_message = process_message(user_message)
    
#     return jsonify({"answer": response_message})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
from pathlib import Path

# Add the parent directory to the system path to import model
sys.path.append(str(Path(__file__).resolve().parents[1] / 'model'))
from model import process_message  # Import process_message from model.py

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response_message = process_message(user_message)
        return jsonify({"answer": response_message})
    except Exception as e:
        print(f"Error processing message: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
