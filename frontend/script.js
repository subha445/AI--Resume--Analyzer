const resumeForm = document.getElementById("resumeForm");
const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

const score = document.getElementById("score");
const skills = document.getElementById("skills");
const missingSkills = document.getElementById("missingSkills");
const suggestions = document.getElementById("suggestions");


// Show selected file
resumeFile.addEventListener("change", function () {

    if (resumeFile.files.length > 0) {
        fileName.textContent =
            "Selected: " + resumeFile.files[0].name;
    } else {
        fileName.textContent = "No file selected";
    }

});


// Submit resume
resumeForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (resumeFile.files.length === 0) {
        alert("Please select a PDF resume.");
        return;
    }

    const file = resumeFile.files[0];

    if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
    }

    // Show loading
    loading.style.display = "block";
    results.style.display = "none";

    // Create form data
    const formData = new FormData();
    formData.append("resume", file);

    try {

        const response = await fetch(
            "http://localhost:5000/analyze",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        // Display score
        animateScore(data.score);

        // Display skills
        skills.innerHTML = "";

        data.skills.forEach(function (skill) {

            const li = document.createElement("li");
            li.textContent = skill;

            skills.appendChild(li);

        });


        // Display missing skills
        missingSkills.innerHTML = "";

        data.missing_skills.forEach(function (skill) {

            const li = document.createElement("li");
            li.textContent = skill;

            missingSkills.appendChild(li);

        });


        // Display suggestions
        suggestions.innerHTML = "";

        data.suggestions.forEach(function (suggestion) {

            const li = document.createElement("li");
            li.textContent = suggestion;

            suggestions.appendChild(li);

        });


        // Show results
        loading.style.display = "none";
        results.style.display = "block";

        results.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        loading.style.display = "none";

        alert(
            "Could not connect to the backend.\n\n" +
            error.message
        );

    }

});function animateScore(targetScore) {

    let currentScore = 0;

    score.textContent = "0";

    const interval = setInterval(function () {

        currentScore++;

        score.textContent = currentScore;

        if (currentScore >= targetScore) {
            clearInterval(interval);
        }

    }, 20);
}