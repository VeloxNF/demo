document.addEventListener("DOMContentLoaded", function () {
    // Fetch header.html dan masukkan ke dalam #header-container
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            
            // Setelah header berhasil dimuat, jalankan ulang fungsi event listener
            initThemeToggle();
            initNavbarToggle();
            highlightActiveNav(); // Tambahkan fungsi ini untuk menyorot navbar aktif
        })
        .catch(error => console.error("Error loading header:", error));
});

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = document.querySelector('.slider i');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeToggle.classList.add('active');
        icon.classList.replace('fa-moon', 'fa-sun');
        icon.style.color = "orange";
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('light-theme');
        themeToggle.classList.toggle('active');

        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-sun', 'fa-moon');
        }
        icon.style.color = "orange";
    });
}

function initNavbarToggle() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li');
    const menuToggle = document.getElementById('menu-toggle');

    function resetAnimations() {
        navLinks.forEach((link) => {
            link.style.opacity = 0;
            link.style.transition = 'opacity 0.2s ease-in-out';
        });
    }

    function startAnimations() {
        navLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = 1;
            }, index * 100);
        });
    }

    function toggleNavbar() {
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            nav.classList.add('inactive');

            setTimeout(() => {
                nav.classList.remove('inactive');
                nav.style.visibility = 'hidden';
            }, 400);
        } else {
            nav.style.visibility = 'visible';
            nav.classList.remove('inactive');
            nav.classList.add('active');
            resetAnimations();
            startAnimations();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            toggleNavbar();
        });
    }
}

// Fungsi untuk menyorot link navbar yang aktif
function highlightActiveNav() {
    let path = window.location.pathname;

    // Jika hanya root "/", anggap sebagai "/index.html"
    if (path === "/") {
        path = "/index.html";
    }

    document.querySelectorAll("nav ul li a").forEach((link) => {
        let linkPath = new URL(link.href).pathname; // Ambil path dari href link
        if (linkPath === path) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}
