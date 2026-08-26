from flask import Flask, request, jsonify
from flask_cors import CORS
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

    # Temporary demo analysis
    result = {
        "score": 78,

        "skills": [
            "Python",
            "HTML & CSS",
            "JavaScript",
            "Problem Solving"
        ],

        "missing_skills": [
            "Machine Learning",
            "SQL",
            "Git & GitHub"
        ],

        "suggestions": [
            "Add measurable project achievements.",
            "Improve your skills section.",
            "Add relevant AI/ML projects.",
            "Keep your resume concise."
        ]
    }

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )