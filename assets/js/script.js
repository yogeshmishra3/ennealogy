// Set the active link based on the current URL or section
function setActiveNewLink() {
    const currentLocation = window.location.href; // Get the full current URL
    const navLinks = document.querySelectorAll('.new-navbar nav ul li a');

    navLinks.forEach(link => {
        if (currentLocation.includes(link.getAttribute('href'))) {
            link.parentElement.classList.add('active'); // Add active class to the parent <li>
        } else {
            link.parentElement.classList.remove('active'); // Remove active class otherwise
        }
    });
}

// Call the function on page load and hash change
window.onload = function() {
    setActiveNewLink(); // Set the active link on load
    showSlides(); // Start the carousel
};

window.addEventListener('hashchange', setActiveNewLink); // Update active link on hash change

// Toggle navbar menu on smaller screens
function toggleNewMenu() {
    const menu = document.querySelector('.new-menu-container');
    menu.classList.toggle('active');

    // Add dropdown animation
    const items = document.querySelectorAll('.new-menu-container ul li');
    if (menu.classList.contains('active')) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show'); // Add 'show' class for animation
                item.style.opacity = '1'; // Ensure opacity is set
                item.style.transform = 'translateY(0)'; // Ensure item is in position
            }, index * 100); // Delay each item for staggered animation effect
        });
    } else {
        items.forEach(item => {
            item.classList.remove('show'); // Remove 'show' class to hide
            item.style.opacity = '0'; // Reset opacity
            item.style.transform = 'translateY(-10px)'; // Reset position
        });
    }
}

// Reset the menu state on window resize
window.addEventListener('resize', function() {
    const menu = document.querySelector('.new-menu-container');
    if (window.innerWidth > 768) { // If width is greater than 768px
        menu.classList.remove('active'); // Ensure the menu is not active
        const items = document.querySelectorAll('.new-menu-container ul li');
        items.forEach(item => {
            item.classList.add('show'); // Ensure items are visible
            item.style.opacity = '1'; // Set opacity back to visible
            item.style.transform = 'translateY(0)'; // Reset position
        });
    }
});

// Navbar color change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.new-navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Carousel functionality (assuming it remains unchanged)
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlides() {
    slides.forEach((slide) => {
        slide.style.display = 'none'; // Hide all slides
    });
    slideIndex++;
    if (slideIndex > slides.length) { 
        slideIndex = 1; // Reset to first slide if index exceeds the number of slides
    }
    slides[slideIndex - 1].style.display = 'block'; // Show the current slide
    setTimeout(showSlides, 5000); // Change slide every 5 seconds
}

// Video hover functionality
document.querySelectorAll('.industry-box').forEach(box => {
    const video = box.querySelector('video');
    
    box.addEventListener('mouseenter', () => {
        video.play();  // Play the video on hover
    });
    
    box.addEventListener('mouseleave', () => {
        video.pause();  // Pause the video when not hovering
        video.currentTime = 0;  // Reset the video to the start
    });
});
