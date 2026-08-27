// ============================
// NOMOR WHATSAPP TOKO
// ============================

const nomorWhatsApp = "085135974307";


// ============================
// FORMAT RUPIAH
// ============================

function formatRupiah(angka) {

    return "Rp" + angka.toLocaleString("id-ID");

}


// ============================
// TOMBOL PESAN (WhatsApp)
// ============================

function kirimPesanWhatsApp(namaMenu, harga) {

    const pesan =
        `Halo Luthfi Coffee, saya ingin memesan ${namaMenu} dengan harga ${formatRupiah(harga)}.`;

    const url =
        `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    window.open(url, "_blank");

}


document.addEventListener("click", function(e) {

    const tombol = e.target.closest(".order-btn");

    if (!tombol) return;

    const namaMenu = tombol.dataset.menu;
    const harga = Number(tombol.dataset.price);

    kirimPesanWhatsApp(namaMenu, harga);

});


const contactBtn = document.querySelector("#contactBtn");

if (contactBtn) {

    contactBtn.addEventListener("click", function() {

        const pesan =
            "Halo Luthfi Coffee, saya ingin bertanya mengenai menu dan pemesanan.";

        const url =
            `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

        window.open(url, "_blank");

    });

}


// ============================
// PILIH UKURAN (S / M / L)
// ============================
// Mengubah harga yang tampil dan data pesanan
// sesuai ukuran yang dipilih pada tiap slide.

document.querySelectorAll(".slide").forEach(function(slide) {

    const priceBlock = slide.querySelector(".slide-price");
    const priceNowEl = slide.querySelector(".price-now");
    const orderBtn = slide.querySelector(".order-btn");
    const namaMenuDasar = slide.querySelector(".slide-title").textContent.trim();

    const basePrice = Number(priceBlock.dataset.basePrice);

    priceBlock.querySelectorAll(".size").forEach(function(sizeBtn) {

        sizeBtn.addEventListener("click", function() {

            priceBlock.querySelectorAll(".size").forEach(function(s) {
                s.classList.remove("active");
            });

            sizeBtn.classList.add("active");

            const diff = Number(sizeBtn.dataset.diff);
            const hargaBaru = basePrice + diff;

            priceNowEl.textContent = formatRupiah(hargaBaru);

            const labelUkuran = sizeBtn.textContent.trim();

            orderBtn.dataset.price = hargaBaru;
            orderBtn.dataset.menu = `${namaMenuDasar} (${labelUkuran})`;

        });

    });

});


// ============================
// SLIDER KOPI (animasi ala video referensi)
// ============================

const sliderEl = document.getElementById("coffeeSlider");
const slidesWrap = document.getElementById("slidesWrap");
const slides = Array.from(document.querySelectorAll(".slide"));
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const nextPreview = document.getElementById("nextPreview");
const nextPreviewImg = document.getElementById("nextPreviewImg");
const dotsWrap = document.getElementById("dots");

let current = 0;
let autoTimer = null;
const AUTO_DELAY = 5000;
const TRANSITION_TIME = 650;

let isAnimating = false;


// Buat titik navigasi (dots) sesuai jumlah slide

slides.forEach(function(_, index) {

    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (index === 0) dot.classList.add("active");

    dot.addEventListener("click", function() {
        goToSlide(index);
    });

    dotsWrap.appendChild(dot);

});

const dots = Array.from(dotsWrap.querySelectorAll(".dot"));


function updateBackground(slide) {

    sliderEl.style.setProperty("--bg1", slide.dataset.bg1);
    sliderEl.style.setProperty("--bg2", slide.dataset.bg2);

}


function updateNextPreview(index) {

    const upcomingIndex = (index + 1) % slides.length;
    const upcomingImg = slides[upcomingIndex].querySelector(".slide-image img");

    nextPreviewImg.src = upcomingImg.src;
    nextPreviewImg.alt = upcomingImg.alt;

}


function updateDots(index) {

    dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === index);
    });

}


function goToSlide(index, isReverse) {

    if (isAnimating || index === current) return;

    isAnimating = true;

    const outgoing = slides[current];
    const incoming = slides[index];

    if (isReverse) {
        outgoing.classList.add("reverse");
        incoming.classList.add("reverse");
    }

    // mulai animasi keluar
    outgoing.classList.add("leaving");

    // set warna latar & pratinjau menuju slide berikutnya
    updateBackground(incoming);
    updateNextPreview(index);
    updateDots(index);

    // slide baru langsung aktif supaya animasi masuknya berjalan bersamaan
    incoming.classList.add("active");

    window.setTimeout(function() {

        outgoing.classList.remove("active", "leaving", "reverse");
        incoming.classList.remove("reverse");

        current = index;
        isAnimating = false;

    }, TRANSITION_TIME);

}


function nextSlide() {

    const nextIndex = (current + 1) % slides.length;
    goToSlide(nextIndex, false);

}


function prevSlide() {

    const prevIndex = (current - 1 + slides.length) % slides.length;
    goToSlide(prevIndex, true);

}


function startAutoPlay() {

    stopAutoPlay();
    autoTimer = window.setInterval(nextSlide, AUTO_DELAY);

}


function stopAutoPlay() {

    if (autoTimer) {
        window.clearInterval(autoTimer);
        autoTimer = null;
    }

}


nextBtn.addEventListener("click", function() {
    nextSlide();
    startAutoPlay();
});

prevBtn.addEventListener("click", function() {
    prevSlide();
    startAutoPlay();
});

nextPreview.addEventListener("click", function() {
    nextSlide();
    startAutoPlay();
});


sliderEl.addEventListener("mouseenter", stopAutoPlay);
sliderEl.addEventListener("mouseleave", startAutoPlay);


// inisialisasi awal

updateBackground(slides[current]);
updateNextPreview(current);
startAutoPlay();
