from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
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
def analyze_resume():

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

    # Extract text from PDF
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

    # Basic analysis
    text_lower = text.lower()

    skills_list = [
        "python",
        "java",
        "javascript",
        "html",
        "css",
        "sql",
        "machine learning",
        "data science",
        "git",
        "github"
    ]

    found_skills = []

    for skill in skills_list:
        if skill in text_lower:
            found_skills.append(skill.title())


    # Skills that were not found
    missing_skills = []

    for skill in skills_list:
        if skill not in text_lower:
            missing_skills.append(skill.title())


    # Calculate basic score
    score = min(100, len(found_skills) * 10 + 20)


    suggestions = [
        "Add more relevant technical skills.",
        "Include your best projects.",
        "Add measurable achievements.",
        "Keep your resume clear and concise."
    ]


    return jsonify({
        "score": score,
        "skills": found_skills,
        "missing_skills": missing_skills[:5],
        "suggestions": suggestions,
        "text_length": len(text)
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )