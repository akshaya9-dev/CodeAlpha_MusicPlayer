// ========================================
// SONG DATA
// ========================================

const songs = [
    {
        title: "Song One",
        artist: "Artist One",
        audio: "assets/music/music1.mp3",
        image: "assets/images/image1.jpg"
    },
    {
        title: "Song Two",
        artist: "Artist Two",
        audio: "assets/music/music2.mp3",
        image: "assets/images/image2.jpg"
    },
    {
        title: "Song Three",
        artist: "Artist Three",
        audio: "assets/music/music3.mp3",
        image: "assets/images/image3.jpg"
    }
];


// ========================================
// DOM ELEMENTS
// ========================================

const audioPlayer = document.getElementById("audio-player");

const playButton = document.getElementById("play-btn");
const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");

const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");
const albumImage = document.getElementById("album-image");

const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const volumeControl = document.getElementById("volume-control");

const playlistButtons = document.querySelectorAll(".song-button");


// ========================================
// CURRENT SONG
// ========================================

let currentSongIndex = 0;


// ========================================
// HELPER FUNCTIONS
// ========================================

// Convert seconds into MM:SS format

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
}


// ========================================
// UPDATE PLAY BUTTON
// ========================================

function updatePlayButton(isPlaying) {

    playButton.textContent = isPlaying ? "⏸" : "▶";

    playButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause Song" : "Play Song"
    );

    playButton.setAttribute(
        "title",
        isPlaying ? "Pause Song" : "Play Song"
    );

    playButton.setAttribute(
        "aria-pressed",
        isPlaying ? "true" : "false"
    );
}


// ========================================
// UPDATE ACTIVE PLAYLIST ITEM
// ========================================

function updateActivePlaylistItem() {

    playlistButtons.forEach((button, index) => {

        const isActive = index === currentSongIndex;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-current",
            isActive ? "true" : "false"
        );
    });
}


// ========================================
// LOAD SONG
// ========================================

function loadSong(index) {

    if (index < 0 || index >= songs.length) {
        return;
    }

    const song = songs[index];

    currentSongIndex = index;

    // Update song information

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;

    // Update album image

    albumImage.src = song.image;
    albumImage.alt = `${song.title} album artwork`;

    // Update audio source

    audioPlayer.src = song.audio;

    // Reset progress

    progressBar.value = 0;

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    // Update playlist

    updateActivePlaylistItem();

    // Reset play button

    updatePlayButton(false);
}


// ========================================
// PLAY SONG
// ========================================

async function playSong() {

    try {

        await audioPlayer.play();

    } catch (error) {

        console.error("Unable to play the song:", error);

        updatePlayButton(false);
    }
}


// ========================================
// PAUSE SONG
// ========================================

function pauseSong() {

    audioPlayer.pause();
}


// ========================================
// PLAY / PAUSE BUTTON
// ========================================

playButton.addEventListener("click", () => {

    if (audioPlayer.paused) {

        playSong();

    } else {

        pauseSong();

    }

});


// ========================================
// AUDIO PLAY EVENT
// ========================================

audioPlayer.addEventListener("play", () => {

    updatePlayButton(true);

});


// ========================================
// AUDIO PAUSE EVENT
// ========================================

audioPlayer.addEventListener("pause", () => {

    updatePlayButton(false);

});


// ========================================
// UPDATE PROGRESS
// ========================================

audioPlayer.addEventListener("timeupdate", () => {

    if (!Number.isFinite(audioPlayer.duration)) {
        return;
    }

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressBar.value = progress;

    currentTimeDisplay.textContent =
        formatTime(audioPlayer.currentTime);

});


// ========================================
// LOAD SONG DURATION
// ========================================

audioPlayer.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent =
        formatTime(audioPlayer.duration);

});


// ========================================
// SEEK SONG
// ========================================

progressBar.addEventListener("input", () => {

    if (!Number.isFinite(audioPlayer.duration)) {
        return;
    }

    const newTime =
        (progressBar.value / 100) * audioPlayer.duration;

    audioPlayer.currentTime = newTime;

});


// ========================================
// CHANGE SONG
// ========================================

function changeSong(index, shouldPlay = true) {

    if (index < 0 || index >= songs.length) {
        return;
    }

    loadSong(index);

    if (shouldPlay) {
        playSong();
    }
}


// ========================================
// NEXT SONG
// ========================================

function playNextSong() {

    let nextIndex = currentSongIndex + 1;

    // Loop back to the first song

    if (nextIndex >= songs.length) {
        nextIndex = 0;
    }

    changeSong(nextIndex);
}


nextButton.addEventListener("click", () => {

    playNextSong();

});


// ========================================
// PREVIOUS SONG
// ========================================

function playPreviousSong() {

    let previousIndex = currentSongIndex - 1;

    // Go to the last song
    // when currently on the first song

    if (previousIndex < 0) {
        previousIndex = songs.length - 1;
    }

    changeSong(previousIndex);
}


previousButton.addEventListener("click", () => {

    playPreviousSong();

});


// ========================================
// VOLUME CONTROL
// ========================================

volumeControl.addEventListener("input", () => {

    const volume = Number(volumeControl.value);

    audioPlayer.volume = volume;

});


// ========================================
// PLAYLIST
// ========================================

playlistButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedIndex =
            Number(button.dataset.songIndex);

        if (
            Number.isInteger(selectedIndex) &&
            selectedIndex >= 0 &&
            selectedIndex < songs.length
        ) {

            changeSong(selectedIndex);

        }

    });

});


// ========================================
// AUTO PLAY NEXT SONG
// ========================================

audioPlayer.addEventListener("ended", () => {

    playNextSong();

});


// ========================================
// INITIAL VOLUME
// ========================================

audioPlayer.volume = Number(volumeControl.value);


// ========================================
// LOAD FIRST SONG
// ========================================

loadSong(currentSongIndex);