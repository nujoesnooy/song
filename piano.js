// 브라우저 오디오 엔진
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let playing = false;

// ---------------------------------------------------
// 단일 음 재생 + 에코 효과
// ---------------------------------------------------
function playFreq(freq, duration){

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.frequency.value = freq;
    osc.type = "sine";

    // 에코 노드
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.3;

    const feedback = audioCtx.createGain();
    feedback.gain.value = 0.4;

    // 연결
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(audioCtx.destination);

    // 음 시작
    osc.start();

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration
    );

    osc.stop(audioCtx.currentTime + duration + 1);
}

// ---------------------------------------------------
// 코드 재생
// ---------------------------------------------------
function playChord(freqs){
    freqs.forEach(f => playFreq(f,1.5));
}

// ---------------------------------------------------
// 코드 구성
// G-D-Em-C
// ---------------------------------------------------
const G  = [196.00,246.94,293.66];
const D  = [146.83,220.00,293.66];
const Em = [164.81,196.00,246.94];
const C  = [130.81,164.81,196.00];

const progression = [G,D,Em,C];

// ---------------------------------------------------
// 코드 루프
// ---------------------------------------------------
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

// ---------------------------------------------------
// UI 버튼 이벤트
// ---------------------------------------------------
document.getElementById("playBtn").onclick = () => {
    if(!playing) startLoop();
}

document.getElementById("stopBtn").onclick = () => {
    playing = false;
}

// ---------------------------------------------------
// 건반 클릭 이벤트
// ---------------------------------------------------
document.querySelectorAll(".key").forEach(key=>{
    key.addEventListener("click",()=>{
        const note = key.dataset.note;
        playFreq({
            "C":130.81,"D":146.83,"E":164.81,"F":174.61,
            "G":196.00,"A":220.00,"B":246.94
        }[note], 1);
    });
});

// ---------------------------------------------------
// 키보드 입력 이벤트
// ---------------------------------------------------
const keyMap={
    a:"C",
    s:"D",
    d:"E",
    f:"F",
    g:"G",
    h:"A",
    j:"B"
};

document.addEventListener("keydown",(e)=>{
    const note = keyMap[e.key];
    if(note){
        playFreq({
            "C":130.81,"D":146.83,"E":164.81,"F":174.61,
            "G":196.00,"A":220.00,"B":246.94
        }[note], 1);
    }
});