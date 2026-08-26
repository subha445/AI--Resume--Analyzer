const resumeForm = document.getElementById("resumeForm");
const resumeFile = document.getElementById("resumeFile");
const fileName = document.getElementById("fileName");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

const score = document.getElementById("score");
const skills = document.getElementById("skills");
const missingSkills = document.getElementById("missingSkills");
const suggestions = document.getElementById("suggestions");


// Show selected file name
resumeFile.addEventListener("change", function () {

    if (resumeFile.files.length > 0) {
        fileName.textContent = "Selected: " + resumeFile.files[0].name;
    } else {
        fileName.textContent = "No file selected";
    }

});


// Analyze resume
resumeForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (resumeFile.files.length === 0) {
        alert("Please select a PDF resume.");
        return;
    }

    const file = resumeFile.files[0];

    // Check PDF
    if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
    }

    // Show loading
    loading.style.display = "block";
    results.style.display = "none";

    // Temporary demo analysis
    setTimeout(function () {

        loading.style.display = "none";
        results.style.display = "block";

        score.textContent = "78";

        skills.innerHTML = `
            <li>Python</li>
            <li>HTML & CSS</li>
            <li>JavaScript</li>
            <li>Problem Solving</li>
        `;

        missingSkills.innerHTML = `
            <li>Machine Learning</li>
            <li>SQL</li>
            <li>Git & GitHub</li>
        `;

        suggestions.innerHTML = `
            <li>Add measurable project achievements.</li>
            <li>Improve your skills section.</li>
            <li>Add relevant AI/ML projects.</li>
            <li>Keep your resume concise.</li>
        `;

        results.scrollIntoView({
            behavior: "smooth"
        });

    }, 2000);

});