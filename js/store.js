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
    const buyButtons = document.querySelectorAll(".buy-btn"); // Tombol Buy Now
    const popupOverlay = document.querySelector(".package-popup-overlay"); // Overlay Popup
    const closeButton = document.querySelector(".package-close-btn"); // Tombol Close
    const popupTitle = document.querySelector(".package-title"); // Nama Produk di Popup
    const popupBadge = document.querySelector(".package-badge"); // Badge Produk
    const popupImage = document.querySelector(".package-product-img"); // Gambar Produk
    const packageOptions = document.querySelector(".package-options"); // Daftar Paket
    const packageFooter = document.querySelector(".package-footer"); // Footer Popup

    if (!buyButtons || !popupOverlay || !closeButton || !popupTitle || !popupImage || !packageOptions || !packageFooter || !popupBadge) {
        console.error("Salah satu elemen tidak ditemukan. Pastikan HTML sesuai.");
        return;
    }

    // Event listener untuk setiap tombol Buy Now
    buyButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productCard = button.closest(".product-card"); // Ambil elemen parent (produk terkait)

            if (!productCard) return;

            // Ambil data dari atribut data-*
            const title = productCard.getAttribute("data-title") || "No Title";
            const image = productCard.getAttribute("data-img") || "";
            const pricesData = productCard.getAttribute("data-prices") || "[]";
            const footer = productCard.getAttribute("data-footer") || "No description available."; // Ambil deskripsi produk

            // Pastikan data harga valid sebelum diparsing
            let prices = [];
            try {
                prices = JSON.parse(pricesData);
                if (!Array.isArray(prices)) throw new Error("Invalid prices format.");
            } catch (error) {
                console.error("Error parsing prices data:", error);
                return;
            }

            // Isi data ke dalam popup
            popupTitle.textContent = title;
            popupBadge.textContent = "Sewa"; // Set badge menjadi "Sewa"
            popupImage.src = image;
            packageOptions.innerHTML = ""; // Hapus opsi lama sebelum menambahkan baru
            packageFooter.textContent = footer; // Tampilkan deskripsi di footer

            // Loop melalui daftar harga dan tambahkan opsi paket
            prices.forEach(price => {
                const optionDiv = document.createElement("div");
                optionDiv.classList.add("package-option");

                // Jika paket populer, tambahkan kelas dan label khusus
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

                packageOptions.appendChild(optionDiv);
            });

            // Tampilkan popup
            popupOverlay.classList.add("package-show");
        });
    });

    // Event listener untuk tombol close
    closeButton.addEventListener("click", function () {
        popupOverlay.classList.remove("package-show");
    });

    // Event listener untuk menutup popup saat klik di luar popup
    popupOverlay.addEventListener("click", function (e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove("package-show");
        }
    });
});

