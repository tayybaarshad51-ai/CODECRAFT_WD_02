// Get the navigation bar
const navbar = document.getElementById("navbar");

// Detect page scrolling
window.addEventListener("scroll", function () {

    // If the page is scrolled more than 50 pixels
    if (window.scrollY > 50) {

        // Add the "scrolled" class
        navbar.classList.add("scrolled");

    } else {

        // Remove the "scrolled" class
        navbar.classList.remove("scrolled");
    }
});