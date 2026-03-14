const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let playing = false;

// 이펙터 노드
const echo = audioCtx.createDelay();
echo.delayTime.value = 0.25;
const echoGain = audioCtx.createGain();
echoGain.gain.value = 0.4;
echo.connect(echoGain).connect(audioCtx.destination);

const reverbGain = audioCtx.createGain();
reverbGain.gain.value = 0.3;
reverbGain.connect(audioCtx.destination);

const chorusGain = audioCtx.createGain();
chorusGain.gain.value = 0.3;
chorusGain.connect(audioCtx.destination);

// 단일 음 재생
function playFreq(freq,duration){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";
    osc.connect(gain);
    gain.connect(echo).connect(echoGain); 
    gain.connect(reverbGain);
    gain.connect(chorusGain);
    gain.gain.setValueAtTime(0.3,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);
    osc.start();
    osc.stop(audioCtx.currentTime+duration);
}

// 코드 재생
function playChord(freqs){
    freqs.forEach(f => playFreq(f,1.5));
}

// 코드 진행 샘플
const C = [261.63,329.63,392.00];
const D = [293.66,369.99,440.00];
const E = [329.63,415.30,493.88];
const F = [349.23,440.00,523.25];
const G = [392.00,493.88,587.33];
const A = [440.00,554.37,659.25];
const B = [493.88,622.25,739.99];

const chords = {C,D,E,F,G,A,B};

// 버튼 이벤트
document.querySelectorAll('.sidebar-left button').forEach(btn=>{
    btn.onclick = ()=>{
        const group = btn.parentElement.previousElementSibling.textContent.trim();
        playChord(chords[group]);
    }
});

// Effects 슬라이더
document.getElementById('echoGain').oninput = e => {echoGain.gain.value = e.target.value;}
document.getElementById('delayTime').oninput = e => {echo.delayTime.value = e.target.value;}
document.getElementById('reverbGain').oninput = e => {reverbGain.gain.value = e.target.value;}
document.getElementById('chorusGain').oninput = e => {chorusGain.gain.value = e.target.value;}

// TODO: 시퀀스 저장/재생, 파형 시각화 추가