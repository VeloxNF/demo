document.addEventListener("DOMContentLoaded", function () {
    var video = document.getElementById("banner-video");
    var image = document.getElementById("banner-image");

    video.oncanplay = function () {
        image.style.display = "none";
        video.style.display = "block";
    };

    video.onerror = function () {
        video.style.display = "none";
        image.style.display = "block";
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const bannerImage = document.getElementById("banner-image");

    const banners = [
        "./img/banner-1.jpg",
        "./img/banner-2.jpg",
        "./img/banner-3.jpg"
    ];

    let index = 0;

    function changeBanner() {
        index = (index + 1) % banners.length;
        bannerImage.src = banners[index];
    }

    setInterval(changeBanner, 5000);
});

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
});
  
const music = document.getElementById("music");
const playBtn = document.getElementById("play-btn");
const musicImage = document.getElementById("music-image");

function togglePlay() {
    if (music.paused) {
        music.play();
        playBtn.classList.replace("fa-play", "fa-pause");
        musicImage.classList.add("playing");
    } else {
        music.pause();
        playBtn.classList.replace("fa-pause", "fa-play");
        musicImage.classList.remove("playing");
    }
}

music.addEventListener("ended", () => {
    playBtn.classList.replace("fa-pause", "fa-play");
    musicImage.classList.remove("playing");
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("fa-spotify")) {
        window.open("https://open.spotify.com/track/12CXx3gXBn9QjGSNYzEh05?si=bae20c3bb82c4703", "_blank");
    }
});

window.addEventListener("click", (event) => {
    if (event.target.id === "music-image") {
        window.open("https://open.spotify.com/track/12CXx3gXBn9QjGSNYzEh05?si=bae20c3bb82c4703", "_blank");
    }
});