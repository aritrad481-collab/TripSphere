document.addEventListener("DOMContentLoaded", () => {

    const darkModeToggle = document.getElementById("darkModeToggle");

    if (!darkModeToggle) {
        console.log("Dark mode button not found!");
        return;
    }

    // Load saved mode
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = "☀️";
    }

    // Toggle mode
    darkModeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = "☀️";

        } else {

            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = "🌙";

        }

    });

});