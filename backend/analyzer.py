def analyze_resume(text):
    text_lower = text.lower()

    # Skills our analyzer can detect
    skills = [
        "Python",
        "Java",
        "JavaScript",
        "HTML",
        "CSS",
        "SQL",
        "Machine Learning",
        "Data Science",
        "Git",
        "GitHub"
    ]

    found_skills = []
    missing_skills = []

    # Find skills in the resume
    for skill in skills:
        if skill.lower() in text_lower:
            found_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Calculate resume score
    score = min(100, 20 + len(found_skills) * 8)

    # Generate suggestions
    suggestions = []

    if "github" not in text_lower:
        suggestions.append("Add your GitHub profile.")

    if "project" not in text_lower:
        suggestions.append("Add 2–3 strong projects.")

    if "machine learning" not in text_lower:
        suggestions.append("Consider adding an AI/ML project.")

    if "sql" not in text_lower:
        suggestions.append("Add SQL if relevant to your target role.")

    if not suggestions:
        suggestions.append(
            "Your resume has a good technical foundation. "
            "Continue adding measurable achievements."
        )

    return {
        "score": score,
        "skills": found_skills,
        "missing_skills": missing_skills[:5],
        "suggestions": suggestions
    }