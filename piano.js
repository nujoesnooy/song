const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let playing = false;

function playFreq(freq, duration){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.stop(audioCtx.currentTime + duration);
}

function playChord(freqs){
    freqs.forEach(f => playFreq(f,1.5));
}

const G  = [196.00,246.94,293.66];
const D  = [146.83,220.00,293.66];
const Em = [164.81,196.00,246.94];
const C = [261.63,329.63,392.00];


const progression = [G,D,Em,C];

async function startLoop(){

    playing = true;

    while(playing){
        for(let chord of progression){

            if(!playing) return;

            playChord(chord);

            await new Promise(r => setTimeout(r,1500));
        }
    }
}

document.getElementById("playBtn").onclick = () => {
    if(!playing) startLoop();
}

document.getElementById("stopBtn").onclick = () => {
    playing = false;
}