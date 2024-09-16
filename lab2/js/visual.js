const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioCtx.destination);

const canvas = document.createElement('canvas');
document.querySelector('.audio-controls').appendChild(canvas);
const canvasCtx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 100;

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        const r = barHeight + 100;
        const g = Math.max(0, 255 - barHeight);
        const b = 50 + (barHeight / 2);

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
    }
}

audioElement.onplay = () => {
    audioCtx.resume();
    drawVisualizer();
};
