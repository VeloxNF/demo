document.querySelectorAll(".show-more").forEach(button => {
    button.addEventListener("click", function (e) {
        e.preventDefault(); // Mencegah reload halaman
        
        let card = this.closest(".product-card"); // Cari card terkait
        let shortDescription = card.querySelector(".short-description"); // Cari deskripsi utama
        let extraContent = card.querySelector(".extra-content"); // Cari konten tambahan
        
        card.classList.toggle("expanded"); // Toggle class "expanded"

        if (card.classList.contains("expanded")) {
            this.textContent = "Show less ⭡";
            shortDescription.textContent = shortDescription.dataset.fullText; // Ambil teks asli dari data attribute
            
            // Tambahkan class agar ada scrollbar
            extraContent.classList.add("scrollable");
        } else {
            this.textContent = "Show more ⭣";
            shortDescription.textContent = shortDescription.dataset.fullText + "..."; // Tambahkan titik-titik
            
            // Hapus class agar scrollbar mati
            extraContent.classList.remove("scrollable");
        }
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".image-container");

    images.forEach(image => {
        image.addEventListener("click", function () {
            // Toggle efek saat diklik
            this.classList.toggle("active");
            
            // Hapus efek setelah 2 detik agar tidak terus aktif
            setTimeout(() => {
                this.classList.remove("active");
            }, 2000);
        });
    });
});

// Fungsi popup info icon
function openPopup(image, title, tag, priceText, price, description) {
    document.getElementById("popup-image").style.backgroundImage = `url(${image})`;
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-tag").innerText = tag;
    document.getElementById("popup-price-text").innerText = priceText;
    document.getElementById("popup-price").innerText = price;
    document.getElementById("popup-description").innerHTML = description;
    document.getElementById("popup").classList.add("active");

    // Jika light mode aktif, ubah warna teks
    if (document.body.classList.contains("light-theme")) {
        document.getElementById("popup-description").style.color = "black";
    } else {
        document.getElementById("popup-description").style.color = "white";
    }
}

function closePopup() {
    document.getElementById("popup").classList.remove("active");
}

document.querySelectorAll(".info-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
        let card = this.closest(".product-card");
        let image = card.querySelector("img").src;
        let title = card.querySelector("h3").innerText;
        let tag = card.querySelector(".tags .popup-tag")?.innerText || "Tidak ada kategori";
        let priceText = card.querySelector(".tags .popup-price-text")?.innerText || "Mulai dari";
        let price = card.querySelector(".tags .popup-price")?.innerText || "Rp0";
        let extraContent = card.querySelector(".extra-content");
        let shortDescription = card.querySelector(".short-description");

        let description = "";

        if (shortDescription && shortDescription.getAttribute("data-full-text").trim() !== "") {
            description += `<p>${shortDescription.getAttribute("data-full-text")}</p>`;
        }

        if (extraContent && extraContent.innerHTML.trim() !== "") {
            description += extraContent.innerHTML.trim();
        }

        // Jika tidak ada deskripsi sama sekali
        if (description.trim() === "") {
            description = "<p>Deskripsi tidak ada</p>";
        }

        openPopup(image, title, tag, priceText, price, description);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Loaded!");

    const buyButtons = document.querySelectorAll(".buy-btn");
    const popupOverlay = document.querySelector(".package-popup-overlay");
    const closeButton = document.querySelector(".package-close-btn");
    const popupTitle = document.querySelector(".package-title");
    const popupBadge = document.querySelector(".package-badge");
    const popupImage = document.querySelector(".package-product-img");
    const packageOptions = document.querySelector(".package-options");
    const packageFooter = document.querySelector(".package-footer");
    const paymentPopup = document.getElementById("paymentPopupOverlay");
    const paymentTitle = document.getElementById("productName");
    const paymentImage = document.getElementById("productImage");
    const paymentPackage = document.getElementById("packageName");
    const payNowButton = document.querySelector(".payment-footer button:nth-child(2)");
    const closePaymentButton = document.querySelector(".payment-close-btn");
    const backButton = document.getElementById("backButton");
    const dropdown = document.querySelector(".dropdown");
    const paymentOptions = document.querySelector(".payment-options");
    const wallets = document.querySelectorAll(".wallet"); // 🔹 Ambil elemen wallet

    let selectedPackage = {};

    function openPackagePopup(button) {
        const productCard = button.closest(".product-card");
        if (!productCard) return;

        const title = productCard.getAttribute("data-title") || "No Title";
        const image = productCard.getAttribute("data-img") || "No Image";
        const pricesData = productCard.getAttribute("data-prices") || "No data available";
        const badge = productCard.getAttribute("data-badge") || "Not in category";
        const footer = productCard.getAttribute("data-footer") || "No description available.";

        let prices = [];
        try {
            prices = JSON.parse(pricesData);
            if (!Array.isArray(prices)) throw new Error("Invalid prices format.");
        } catch (error) {
            console.error("Error parsing prices data:", error);
            return;
        }

        popupTitle.textContent = title;
        popupBadge.textContent = badge;
        popupImage.src = image;
        packageOptions.innerHTML = "";
        packageFooter.textContent = footer;

        prices.forEach(price => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("package-option");

            let popularBadge = "";
            if (price.popular) {
                optionDiv.classList.add("package-popular");
                popularBadge = `<span class="popular-badge">🔥 POPULAR</span>`;
            }

            optionDiv.innerHTML = `
                <div class="package-info">
                    ${popularBadge}
                    <span class="package-duration">${price.duration || "Unknown"}</span><br>
                    <span class="package-per-day">${price.per_day || "N/A"}</span>
                </div>
                <div class="package-right">
                    <span class="package-price">${price.price || "N/A"}</span>
                    <span class="select-text">Select &gt;</span>
                </div>
            `;

            optionDiv.addEventListener("click", function () {
                selectedPackage = {
                    title: title,
                    image: image,
                    duration: price.duration,
                    price: price.price
                };

                localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));
                openPaymentPopup();
            });

            packageOptions.appendChild(optionDiv);
        });

        popupOverlay.classList.add("package-show");
    }

    buyButtons.forEach(button => {
        button.addEventListener("click", function () {
            openPackagePopup(button);
        });
    });

    closeButton.addEventListener("click", function () {
        popupOverlay.classList.remove("package-show");
    });

    popupOverlay.addEventListener("click", function (e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove("package-show");
        }
    });

    function openPaymentPopup() {
        console.log("✅ openPaymentPopup dipanggil!");
    
        let selectedPackage = localStorage.getItem("selectedPackage");
    
        if (!selectedPackage) {
            console.error("⚠️ Tidak ada paket yang dipilih di localStorage!");
            return;
        }
    
        selectedPackage = JSON.parse(selectedPackage);
    
        paymentTitle.textContent = selectedPackage.title;
        paymentImage.src = selectedPackage.image;
        paymentPackage.innerHTML = `
            <p>${selectedPackage.duration}</p>
            <p>${selectedPackage.price}</p>
        `;
    
        paymentPopup.classList.add("show");
        popupOverlay.classList.remove("package-show");
    }

    function closePaymentPopup() {
        paymentPopup.classList.remove("show");
        clearWalletSelection(); // 🔹 Hapus pilihan wallet saat popup ditutup
    }
    
    closePaymentButton.addEventListener("click", closePaymentPopup);
    backButton.addEventListener("click", closePaymentPopup);
    
    // Tutup popup jika klik di luar area popup
    paymentPopup.addEventListener("click", function (e) {
        if (e.target === paymentPopup) {
            closePaymentPopup();
        }
    });

    // 🔹 Fungsi untuk menghapus pilihan wallet saat payment popup ditutup
    function clearWalletSelection() {
        wallets.forEach(w => w.classList.remove("selected"));
    }

    // 🔹 Event listener untuk memilih wallet
    wallets.forEach(wallet => {
        wallet.addEventListener("click", function () {
            wallets.forEach(w => w.classList.remove("selected"));
            this.classList.add("selected");
        });
    });
});
