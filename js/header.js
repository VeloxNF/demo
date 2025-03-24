document.addEventListener("DOMContentLoaded", function () {
    // Fetch header.html dan masukkan ke dalam #header-container
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            
            // Setelah header berhasil dimuat, jalankan ulang fungsi event listener
            initThemeToggle();
            initNavbarToggle();
        })
        .catch(error => console.error("Error loading header:", error));
});

function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = document.querySelector('.slider i');
    const body = document.body;

    // Cek jika ada tema yang tersimpan di localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-theme');
        themeToggle.classList.add('active');
        icon.classList.replace('fa-moon', 'fa-sun');
        icon.style.color = "orange";
    }

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('light-theme');
        themeToggle.classList.toggle('active');

        // Simpan pilihan tema ke localStorage
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

    document.querySelectorAll("nav ul li a").forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
}