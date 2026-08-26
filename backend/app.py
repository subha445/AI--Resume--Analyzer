from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
from analyzer import analyze_resume
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


@app.route("/")
def home():
    return jsonify({
        "message": "AI Resume Analyzer API is running!"
    })


@app.route("/analyze", methods=["POST"])
def analyze_resume_file():

    if "resume" not in request.files:
        return jsonify({
            "error": "No resume file uploaded"
        }), 400

    resume = request.files["resume"]

    if resume.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    if not resume.filename.lower().endswith(".pdf"):
        return jsonify({
            "error": "Only PDF files are allowed"
        }), 400

    file_path = os.path.join(
        UPLOAD_FOLDER,
        resume.filename
    )

    resume.save(file_path)

    try:
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    except Exception as error:
        return jsonify({
            "error": f"Could not read PDF: {str(error)}"
        }), 500

    if not text.strip():
        return jsonify({
            "error": "Could not extract text from this PDF."
        }), 400

    # Analyze the extracted resume text
    result = analyze_resume(text)

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )