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

    // Ambil elemen-elemen penting
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
    const closePaymentButton = document.querySelector(".payment-close-btn");
    const backButton = document.getElementById("backButton");
    const wallets = document.querySelectorAll(".wallet");
    const checkoutButton = document.querySelector(".checkout-btn");
    const emailInput = document.getElementById("emailInput");
    const transactionPopup = document.getElementById("transaction-popup");
    const closeTransactionButton = document.querySelector(".transaction-cancel");

    let selectedPaymentMethod = "";
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
            if (price.popular) {
                optionDiv.classList.add("package-popular");
                optionDiv.innerHTML = `<span class="popular-badge">🔥 POPULAR</span>`;
            }
            optionDiv.innerHTML += `
                <div class="package-info">
                    <span class="package-duration">${price.duration || "Unknown"}</span><br>
                    <span class="package-per-day">${price.per_day || "N/A"}</span>
                </div>
                <div class="package-right">
                    <span class="package-price">${price.price || "N/A"}</span>
                    <span class="select-text">Select &gt;</span>
                </div>
            `;

            optionDiv.addEventListener("click", function () {
                selectedPackage = { title, image, duration: price.duration, price: price.price };
                localStorage.setItem("selectedPackage", JSON.stringify(selectedPackage));
                openPaymentPopup();
            });

            packageOptions.appendChild(optionDiv);
        });

        popupOverlay.classList.add("package-show");
    }

    function openPaymentPopup() {
        let storedPackage = localStorage.getItem("selectedPackage");
        
        selectedPackage = JSON.parse(storedPackage);
        paymentTitle.textContent = selectedPackage.title;
        paymentImage.src = selectedPackage.image;
        paymentPackage.innerHTML = `<p>${selectedPackage.duration}</p><p>${selectedPackage.price}</p>`;
        paymentPopup.classList.add("show");
        popupOverlay.classList.remove("package-show");
    }

    function closePaymentPopup() {
        paymentPopup.classList.remove("show");
        clearWalletSelection();
        
        // Hapus data dari localStorage saat popup ditutup
        if (localStorage.getItem("orderData")) {
            localStorage.removeItem("orderData");
        }
        if (localStorage.getItem("selectedPackage")) {
            localStorage.removeItem("selectedPackage");
        }

        // Reset selectedPaymentMethod agar pengguna harus memilih ulang
        selectedPaymentMethod = "";
    }

    function clearWalletSelection() {
        wallets.forEach(w => w.classList.remove("selected"));
    }

    function selectPayment(paymentMethod) {
        selectedPaymentMethod = paymentMethod;
    }

    function showCustomAlert(message, type = "error") {
        const alertBox = document.getElementById("customAlert");
        alertBox.textContent = message;
    
        // Hapus class sebelumnya agar tidak bentrok
        alertBox.classList.remove("error", "success");
    
        // Tambahkan class sesuai tipe pesan
        if (type === "success") {
            alertBox.classList.add("success");
        } else {
            alertBox.classList.add("error");
        }
    
        alertBox.classList.add("show");
    
        setTimeout(() => {
            alertBox.classList.remove("show");
        }, 3000);
    }
    
    
    function checkout() {
        const email = emailInput.value.trim();
        if (!email) return showCustomAlert("❌ Harap masukkan email terlebih dahulu!", "error");
        if (!selectedPaymentMethod) return showCustomAlert("❌ Harap pilih metode pembayaran terlebih dahulu!", "error");
    
        let storedPackage = localStorage.getItem("selectedPackage");
        if (!storedPackage) return showCustomAlert("❌ Harap pilih produk terlebih dahulu!", "error");
        selectedPackage = JSON.parse(storedPackage);
    
        const orderData = {
            email,
            paymentMethod: selectedPaymentMethod,
            productName: selectedPackage.title,
            productImage: selectedPackage.image,
            packageDuration: selectedPackage.duration,
            packagePrice: selectedPackage.price
        };
    
        // Simpan data order ke localStorage
        localStorage.setItem("orderData", JSON.stringify(orderData));
    
        // **Tutup popup payment secara otomatis tanpa menghapus localStorage**
        paymentPopup.classList.remove("show");

        // **Pastikan `transactionPopup` muncul setelah paymentPopup tertutup**
        setTimeout(() => {
            showTransactionPopup();
        }, 300); // Delay sedikit agar tampilan tidak bertabrakan
    }
    
    

    function showTransactionPopup() {

        const orderData = JSON.parse(localStorage.getItem("orderData"));
        if (!orderData) return;

        document.getElementById("transaction-product-image").src = orderData.productImage;
        document.getElementById("transaction-product-name").textContent = orderData.productName;
        document.getElementById("transaction-package-duration").textContent = orderData.packageDuration;
        document.getElementById("transaction-subtotal-price").textContent = orderData.packagePrice;
        document.getElementById("transaction-total-price").textContent = orderData.packagePrice;

        if (orderData.paymentMethod === "QRIS") {
            document.getElementById("transaction-payment-qris").classList.remove("hidden");
            document.getElementById("transaction-payment-other").classList.add("hidden");
        } else {
            document.getElementById("transaction-payment-qris").classList.add("hidden");
            document.getElementById("transaction-payment-other").classList.remove("hidden");
            document.getElementById("transaction-payment-logo").src = `/img/${orderData.paymentMethod.toLowerCase()}.png`;
            document.getElementById("transaction-payment-number").textContent = "082351108031";
        }

        // Memunculkan popup
        transactionPopup.style.display = "flex"; // Pastikan display diubah
        setTimeout(() => {
            transactionPopup.style.visibility = "visible";
            transactionPopup.style.opacity = "1";
        }, 10); // Sedikit delay agar transition berjalan dengan baik
    }

        // Fungsi menutup popup transaksi & menghapus data jika cancel/close ditekan
        function cancelTransaction() {
            const transactionPopup = document.getElementById("transaction-popup");
            const paymentPopup = document.getElementById("payment-popup");
        
        
            // Hapus data order yang tersimpan di localStorage
            localStorage.removeItem("orderData");
        
    
        
            // Tutup popup transaksi
            closeTransactionPopup();
        }
        
        

        // Fungsi menutup popup transaksi
        function closeTransactionPopup() {
            const transactionPopup = document.getElementById("transaction-popup");
            const paymentPopup = document.getElementById("payment-popup");
            clearWalletSelection();
        

            // Reset selectedPaymentMethod agar pengguna harus memilih ulang
            selectedPaymentMethod = "";

            function clearWalletSelection() {
                wallets.forEach(w => w.classList.remove("selected"));
            }

        
            transactionPopup.style.opacity = "0";
            setTimeout(() => {
                transactionPopup.style.visibility = "hidden";
                transactionPopup.style.display = "none"; // Sembunyikan kembali
            }, 300);
    
        }
        


        buyButtons.forEach(button => button.addEventListener("click", () => openPackagePopup(button)));
        closeButton.addEventListener("click", () => popupOverlay.classList.remove("package-show"));
        popupOverlay.addEventListener("click", e => { if (e.target === popupOverlay) popupOverlay.classList.remove("package-show"); });
        closePaymentButton.addEventListener("click", closePaymentPopup);
        backButton.addEventListener("click", closePaymentPopup);
        paymentPopup.addEventListener("click", e => { if (e.target === paymentPopup) closePaymentPopup(); });
        closeTransactionButton.addEventListener("click", closeTransactionPopup);

        wallets.forEach(wallet => {
            wallet.addEventListener("click", function () {
                wallets.forEach(w => w.classList.remove("selected"));
                this.classList.add("selected");
                selectPayment(this.querySelector("img").alt);
            });
        });
        checkoutButton.addEventListener("click", checkout);

        window.selectPayment = selectPayment;
        window.checkout = checkout;
        window.cancelTransaction = cancelTransaction;
        window.closeTransactionPopup = closeTransactionPopup;

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

        // Event listener untuk tombol "Order" di popup info agar otomatis buka popup package
        const orderButton = document.querySelector(".order-btn"); // Tombol Order di Info Popup
        if (orderButton) {
            orderButton.addEventListener("click", function () {
                closePopup(); // Menutup popup info

                // Cari produk yang sedang ditampilkan di info popup
                let popupTitle = document.getElementById("popup-title").innerText;

                // Cari produk yang memiliki judul yang sama di daftar produk
                let targetProduct = [...document.querySelectorAll(".product-card")].find(card => 
                    card.querySelector("h3")?.innerText.trim() === popupTitle.trim()
                );

                if (targetProduct) {
                    let buyNowButton = targetProduct.querySelector(".buy-btn");
                    if (buyNowButton) {
                        buyNowButton.click(); // Klik otomatis tombol Buy Now
                    }
                }
            });
        }
    
});
