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


// Analyze resume
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

    loading.style.display = "block";
    results.style.display = "none";

    /*
     * Backend connection
     *
     * This will be changed to your deployed
     * Flask backend URL later.
     */
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

        displayResults(data);

    } catch (error) {

        console.error(error);

        loading.style.display = "none";

        alert(
            "Backend is not connected yet.\n\n" +
            "The frontend is working, but the Python backend "
            + "needs to be deployed."
        );

    }

});


// Display analysis results
function displayResults(data) {

    loading.style.display = "none";
    results.style.display = "block";

    // Animate score
    animateScore(data.score);

    // Skills
    skills.innerHTML = "";

    data.skills.forEach(function (skill) {

        const li = document.createElement("li");
        li.textContent = skill;

        skills.appendChild(li);

    });


    // Missing skills
    missingSkills.innerHTML = "";

    data.missing_skills.forEach(function (skill) {

        const li = document.createElement("li");
        li.textContent = skill;

        missingSkills.appendChild(li);

    });


    // Suggestions
    suggestions.innerHTML = "";

    data.suggestions.forEach(function (suggestion) {

        const li = document.createElement("li");
        li.textContent = suggestion;

        suggestions.appendChild(li);

    });


    results.scrollIntoView({
        behavior: "smooth"
    });
}


// Score animation
function animateScore(targetScore) {

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