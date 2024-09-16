const audioElement = new Audio('music/muz1.mp3');
let currentTrackIndex = 0;
let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        audioElement.pause();
        document.getElementById('play-pause-icon').src = 'icons/play.png';
    } else {
        audioElement.play();
        document.getElementById('play-pause-icon').src = 'icons/pause.png';
    }
    isPlaying = !isPlaying;
}


audioElement.addEventListener('timeupdate', () => {
    const progressBar = document.getElementById('progress-bar');

    if (!progressBar.dragging) {
        progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
    }
});


const progressBar = document.getElementById('progress-bar');
progressBar.addEventListener('mousedown', () => {
    progressBar.dragging = true;
});

progressBar.addEventListener('mouseup', () => {
    progressBar.dragging = false;
    changeAudioPosition();
});

progressBar.addEventListener('input', () => {
    if (progressBar.dragging) {
        audioElement.currentTime = (progressBar.value / 100) * audioElement.duration;
    }
});

function changeAudioPosition() {
    audioElement.currentTime = (progressBar.value / 100) * audioElement.duration;
}


function changeTrack(trackNumber) {
    const audioFiles = ['music/muz1.mp3', 'music/muz2.mp3', 'music/muz3.mp3'];
    const trackNames = ['Hungarian Dance No. 5', 'The Nutcracker', 'Primavera'];

    currentTrackIndex = (trackNumber + audioFiles.length - 1) % audioFiles.length;

    const progressBar = document.getElementById('progress-bar');

    progressBar.classList.add('hidden');

    audioElement.src = audioFiles[currentTrackIndex];
    document.getElementById('audio-filename').textContent = trackNames[currentTrackIndex];

    audioElement.addEventListener('loadedmetadata', () => {
        progressBar.value = 0;

        progressBar.classList.remove('hidden');

        audioElement.play();
        document.getElementById('play-pause-icon').src = 'icons/pause.png';
        isPlaying = true;
    }, { once: true });
}

function nextTrack() {
    changeTrack(currentTrackIndex + 2);
}

function previousTrack() {
    changeTrack(currentTrackIndex);
}


function uploadAudio(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('audio-filename').textContent = file.name;

        audioElement.src = URL.createObjectURL(file);
        audioElement.play();
        document.getElementById('play-pause-icon').src = 'icons/pause.png';
        isPlaying = true;
    }
}

audioElement.addEventListener('ended', nextTrack);

function stopAutoSwitch() {
    clearInterval(intervalId);
}
