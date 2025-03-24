const music = document.getElementById("music");
const playBtn = document.getElementById("play-btn");
const musicImage = document.getElementById("music-image");

function togglePlay() {
    if (music.paused) {
        music.play();
        playBtn.classList.remove("fa-play");
        playBtn.classList.add("fa-pause");
        musicImage.classList.add("playing");
    } else {
        music.pause();
        playBtn.classList.remove("fa-pause");
        playBtn.classList.add("fa-play");
        musicImage.classList.remove("playing");
    }
}

// Hentikan animasi saat musik selesai
music.addEventListener("ended", () => {
    playBtn.classList.remove("fa-pause");
    playBtn.classList.add("fa-play");
    musicImage.classList.remove("playing");
});

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("fa-spotify")) {
        console.log("Ikon Spotify diklik!");
        window.open("https://open.spotify.com/track/12CXx3gXBn9QjGSNYzEh05?si=bae20c3bb82c4703", "_blank");
    }
});


window.onclick = function (event) {
    // Cek apakah elemen yang diklik memiliki ID "music-image"
    if (event.target.id === "music-image") {
        window.open("https://open.spotify.com/track/12CXx3gXBn9QjGSNYzEh05?si=bae20c3bb82c4703", "_blank");
    }
};