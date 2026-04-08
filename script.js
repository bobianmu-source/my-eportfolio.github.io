// ===============================
// Smooth Scrolling for Nav Links
// ===============================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ===============================
// Fade-in Animation on Scroll
// ===============================
// Fixed: Now queries 'main section' to include new #projects section
const sections = document.querySelectorAll("main section"); 

const revealOnScroll = () => {
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run once on load

// ===============================
// Highlight Active Nav Link
// ===============================
const navLinks = document.querySelectorAll("#topMenu a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    // Fixed: Corrected offset for sticky nav
    if (pageYOffset >= sectionTop - 75) { 
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    // This will now correctly find #About (with capital A)
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ===============================
// Dynamic Year in Footer
// ===============================
const footer = document.querySelector("footer p:last-child"); // Target last p
if (footer) {
  footer.innerHTML = `Created by Bob Ian Muga. &copy; ${new Date().getFullYear()}`;
}

// ===============================
// Simple Form Feedback
// ===============================
const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thank you for your message! I’ll get back to you soon.");
    form.reset();
  });
}

// ===============================
// Scroll Progress Bar
// ===============================
const progressBar = document.getElementById("progressBar");
let scrollTimeout;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY; // how far user has scrolled
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  progressBar.style.width = scrollPercent + "%";
  progressBar.style.opacity = 1;

  // Color shift from aqua → purple → red
  if (scrollPercent < 33) {
    progressBar.style.background = "aqua";
  } else if (scrollPercent < 66) {
    progressBar.style.background = "purple";
  } else {
    progressBar.style.background = "red";
  }

  // Hide progress bar after scrolling stops
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    progressBar.style.opacity = 0;
  }, 1000);
});

// ===============================
// Dark Mode Toggle with Persistence
// ===============================
const toggleCheckbox = document.getElementById("toggleTheme");

// On page load, check saved preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  toggleCheckbox.checked = true;
} else if (localStorage.getItem("theme") === "light") {
  document.body.classList.remove("dark-mode");
  toggleCheckbox.checked = false;
} else {
  // If no preference saved, fall back to system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark-mode");
    toggleCheckbox.checked = true;
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Toggle on change and save preference
toggleCheckbox.addEventListener("change", () => {
  if (toggleCheckbox.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});


// ===============================
// Added: Search Function (Section Filter)
// ===============================
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

const filterSections = () => {
  const query = searchInput.value.toLowerCase().trim();
  
  sections.forEach(section => {
    // We check against section text, and also allow 'home' to always show
    const sectionText = section.textContent.toLowerCase();
    const sectionId = section.id.toLowerCase();
    
    if (sectionText.includes(query) || sectionId === "home") {
        // Reset display to default (block, flex, etc.)
        section.style.display = ""; 
    } else {
        section.style.display = "none";
    }
  });

  // Special case for #About, which uses flex
  const aboutSection = document.getElementById("About");
  if (aboutSection.style.display !== "none") {
      aboutSection.style.display = "flex";
  }
};

searchButton.addEventListener("click", filterSections);
// Also filter as user types
searchInput.addEventListener("keyup", filterSections);


// ===============================
// Added: Image Switcher / Gallery Logic
// ===============================

let slideIndex = 1;
let slideTimer; // Variable to hold the timer

// Main function to show the slides
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("gallery-slide");
  
  // *** THE FIX ***
  // If there are no slides on this page, stop immediately.
  if (slides.length === 0) {
    return;
  }

  // Loop back to start or end
  if (n > slides.length) { slideIndex = 1; }
  if (n < 1) { slideIndex = slides.length; }
  
  // Hide all slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  // Show the current slide
  slides[slideIndex - 1].style.display = "flex";
}

// Function to start (or restart) the automatic timer
function startSlideShow() {
  // Clear any existing timer
  clearInterval(slideTimer);
  
  // *** THE FIX ***
  // Only start a new timer if slides actually exist on the page.
  if (document.getElementsByClassName("gallery-slide").length > 0) {
    slideTimer = setInterval(() => {
      slideIndex++; // Increment index
      showSlides(slideIndex); // Show next slide
    }, 3000); 
  }
}

// Next/previous controls (called by HTML, so must be global)
function plusSlides(n) {
  showSlides(slideIndex += n); // Show the new slide
  startSlideShow(); // Reset the timer when user clicks
}

// ===============================
//  *** This is the code that runs everything ***
// ===============================
// These calls are now safe because of the checks *inside* the functions.

// Show the first slide
showSlides(slideIndex);

// Start the automatic slideshow
startSlideShow();