// 오디오 엔진
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.5;
masterGain.connect(audioCtx.destination);

// 이펙터 노드
const delayNode = audioCtx.createDelay();
delayNode.delayTime.value = 0.25;

const feedbackGain = audioCtx.createGain();
feedbackGain.gain.value = 0.4;

delayNode.connect(feedbackGain);
feedbackGain.connect(delayNode);
delayNode.connect(masterGain);

// Reverb & Chorus (간단한 Gain 기반)
const reverbGain = audioCtx.createGain();
reverbGain.gain.value = 0.3;
reverbGain.connect(masterGain);

const chorusGain = audioCtx.createGain();
chorusGain.gain.value = 0.3;
chorusGain.connect(masterGain);

// AnalyserNode (파형)
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
masterGain.connect(analyser);

// --------------------
// 코드 정의 (C~B 그룹 정리)
// --------------------
const chordGroups = {
  C:["CM","Cm","C7","CM7","Cm7","Csus4"],
  D:["D","Dm","D7","DM7","Dm7","Dsus4"],
  E:["E","Em","E7","EM7","Em7","Esus4"],
  F:["F","Fm","F7","FM7","Fm7","Fsus4"],
  G:["G","Gm","G7","GM7","Gm7","Gsus4"],
  A:["A","Am","A7","AM7","Am7","Asus4"],
  B:["B","Bm","B7","BM7","Bm7","Bsus4"]
};

const chordFrequencies = {
  "CM":[261.63,329.63,392.00], "Cm":[261.63,311.13,392.00], "C7":[261.63,329.63,392.00,466.16],
  "CM7":[261.63,329.63,392.00,493.88], "Cm7":[261.63,311.13,392.00,466.16], "Csus4":[261.63,349.23,392.00],
  "D":[293.66,369.99,440.00], "Dm":[293.66,349.23,440.00], "D7":[293.66,369.99,440.00,523.25],
  "DM7":[293.66,369.99,440.00,554.37], "Dm7":[293.66,349.23,440.00,523.25], "Dsus4":[293.66,440.00,369.99],
  "E":[329.63,415.30,493.88], "Em":[329.63,392.00,493.88], "E7":[329.63,415.30,493.88,587.33],
  "EM7":[329.63,415.30,493.88,659.26], "Em7":[329.63,392.00,493.88,587.33], "Esus4":[329.63,493.88,415.30],
  "F":[349.23,440.00,523.25], "Fm":[349.23,415.30,523.25], "F7":[349.23,440.00,523.25,622.25],
  "FM7":[349.23,440.00,523.25,659.26], "Fm7":[349.23,415.30,523.25,622.25], "Fsus4":[349.23,440.00,523.25],
  "G":[392.00,493.88,587.33], "Gm":[392.00,466.16,587.33], "G7":[392.00,493.88,587.33,698.46],
  "GM7":[392.00,493.88,587.33,739.99], "Gm7":[392.00,466.16,587.33,698.46], "Gsus4":[392.00,493.88,587.33],
  "A":[440.00,554.37,659.26], "Am":[440.00,523.25,659.26], "A7":[440.00,554.37,659.26,739.99],
  "AM7":[440.00,554.37,659.26,830.61], "Am7":[440.00,523.25,659.26,739.99], "Asus4":[440.00,554.37,659.26],
  "B":[493.88,622.25,739.99], "Bm":[493.88,587.33,739.99], "B7":[493.88,622.25,739.99,830.61],
  "BM7":[493.88,622.25,739.99,987.77], "Bm7":[493.88,587.33,739.99,830.61], "Bsus4":[493.88,622.25,739.99]
};

// --------------------
// 단일 음 재생 함수
// --------------------
function playFreq(freq,duration=1){
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine";

    // 이펙트 연결
    osc.connect(gain);
    gain.connect(delayNode);
    gain.connect(reverbGain);
    gain.connect(chorusGain);
    gain.connect(masterGain);

    osc.start();
    gain.gain.setValueAtTime(0.3,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);
    osc.stop(audioCtx.currentTime+duration+1);
}

// --------------------
// 코드 재생
// --------------------
function playChord(freqs){
    freqs.forEach(f=>playFreq(f,1.5));
}

// --------------------
// 코드 UI 생성
// --------------------
const chordContainer = document.querySelector(".chords");
const sequenceDiv = document.getElementById("sequence");
let sequence = [];

for(let group in chordGroups){
    const header = document.createElement("h4");
    header.textContent = group;
    chordContainer.appendChild(header);
    chordGroups[group].forEach(chord=>{
        const btn = document.createElement("button");
        btn.textContent=chord;
        btn.onclick=()=>{
            playChord(chordFrequencies[chord]);
            sequence.push(chord);
            renderSequence();
        };
        chordContainer.appendChild(btn);
    });
}

function renderSequence(){
    sequenceDiv.textContent = sequence.join(" → ");
}

// --------------------
// 시퀀스 재생 / 초기화
// --------------------
document.getElementById("playSeq").onclick = ()=>{
    sequence.forEach((chord,i)=>{
        setTimeout(()=>playChord(chordFrequencies[chord]), i*1800);
    });
};
document.getElementById("clearSeq").onclick = ()=>{
    sequence=[];
    renderSequence();
};

// --------------------
// 이펙터 조정
// --------------------
document.getElementById("echoGain").oninput = e=>feedbackGain.gain.value = parseFloat(e.target.value);
document.getElementById("delayTime").oninput = e=>delayNode.delayTime.value = parseFloat(e.target.value);
document.getElementById("reverbGain").oninput = e=>reverbGain.gain.value = parseFloat(e.target.value);
document.getElementById("chorusGain").oninput = e=>chorusGain.gain.value = parseFloat(e.target.value);

// --------------------
// 파형 시각화
// --------------------
const canvas = document.getElementById("waveform");
const ctx = canvas.getContext("2d");

function drawWaveform(){
    requestAnimationFrame(drawWaveform);
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.fillStyle="#1a1a1a";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.lineWidth=2;
    ctx.strokeStyle="#00ffcc";
    ctx.beginPath();
    let sliceWidth = canvas.width / bufferLength;
    let x=0;
    for(let i=0;i<bufferLength;i++){
        const v = dataArray[i]/128.0;
        const y = v*canvas.height/2;
        if(i===0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
        x+=sliceWidth;
    }
    ctx.lineTo(canvas.width,canvas.height/2);
    ctx.stroke();
}
drawWaveform();