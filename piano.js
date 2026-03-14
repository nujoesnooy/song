// 오디오 설정
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.5;
masterGain.connect(audioCtx.destination);

// 이펙터
const delayNode = audioCtx.createDelay();
delayNode.delayTime.value=0.25;
const feedbackGain = audioCtx.createGain();
feedbackGain.gain.value=0.4;
delayNode.connect(feedbackGain);
feedbackGain.connect(delayNode);
delayNode.connect(masterGain);

const reverbGain = audioCtx.createGain();
reverbGain.gain.value=0.3;
reverbGain.connect(masterGain);

const chorusGain = audioCtx.createGain();
chorusGain.gain.value=0.3;
chorusGain.connect(masterGain);

// 파형 분석
const analyser = audioCtx.createAnalyser();
analyser.fftSize=1024;
masterGain.connect(analyser);

// -----------------
// 코드 정의 (사용자 지정 순서)
// -----------------
const chordGroups={
  C:["C","C7","Cm","Cm7","CM7","Csus4"],
  D:["D","D7","Dm","Dm7","DM7","Dsus4"],
  E:["E","E7","Em","Em7","EM7","Esus4"],
  F:["F","F7","Fm","Fm7","FM7","Fsus4"],
  G:["G","G7","Gm","Gm7","GM7","Gsus4"],
  A:["A","A7","Am","Am7","AM7","Asus4"],
  B:["B","B7","Bm","Bm7","BM7","Bsus4"]
};

const chordFrequencies={
  "C":[261.63,329.63,392.00], "C7":[261.63,329.63,392.00,466.16], "Cm":[261.63,311.13,392.00],
  "Cm7":[261.63,311.13,392.00,466.16], "CM7":[261.63,329.63,392.00,493.88], "Csus4":[261.63,349.23,392.00],
  "D":[293.66,369.99,440.00], "D7":[293.66,369.99,440.00,523.25], "Dm":[293.66,349.23,440.00],
  "Dm7":[293.66,349.23,440.00,523.25], "DM7":[293.66,369.99,440.00,554.37], "Dsus4":[293.66,440.00,369.99],
  "E":[329.63,415.30,493.88], "E7":[329.63,415.30,493.88,587.33], "Em":[329.63,392.00,493.88],
  "Em7":[329.63,392.00,493.88,587.33], "EM7":[329.63,415.30,493.88,659.26], "Esus4":[329.63,493.88,415.30],
  "F":[349.23,440.00,523.25], "F7":[349.23,440.00,523.25,622.25], "Fm":[349.23,415.30,523.25],
  "Fm7":[349.23,415.30,523.25,622.25], "FM7":[349.23,440.00,523.25,659.26], "Fsus4":[349.23,440.00,523.25],
  "G":[392.00,493.88,587.33], "G7":[392.00,493.88,587.33,698.46], "Gm":[392.00,466.16,587.33],
  "Gm7":[392.00,466.16,587.33,698.46], "GM7":[392.00,493.88,587.33,739.99], "Gsus4":[392.00,493.88,587.33],
  "A":[440.00,554.37,659.26], "A7":[440.00,554.37,659.26,739.99], "Am":[440.00,523.25,659.26],
  "Am7":[440.00,523.25,659.26,739.99], "AM7":[440.00,554.37,659.26,830.61], "Asus4":[440.00,554.37,659.26],
  "B":[493.88,622.25,739.99], "B7":[493.88,622.25,739.99,830.61], "Bm":[493.88,587.33,739.99],
  "Bm7":[493.88,587.33,739.99,830.61], "BM7":[493.88,622.25,739.99,987.77], "Bsus4":[493.88,622.25,739.99]
};

// -----------------
// 음/코드 재생
function playFreq(freq,duration=1){
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.frequency.value=freq;
  osc.type="sine";
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
function playChord(freqs){ freqs.forEach(f=>playFreq(f,1.5)); }

// -----------------
// UI 코드 버튼 생성
const chordContainer=document.querySelector(".chords");
const sequenceDiv=document.getElementById("sequence");
let sequence=[];
let loopPlaying=false;

for(let g in chordGroups){
  const h=document.createElement("h4"); h.textContent=g; chordContainer.appendChild(h);
  chordGroups[g].forEach(c=>{
    const b=document.createElement("button"); b.textContent=c;
    b.onclick=()=>{
      playChord(chordFrequencies[c]);
      sequence.push(c); renderSequence();
    };
    chordContainer.appendChild(b);
  });
}
function renderSequence(){ sequenceDiv.textContent=sequence.join(" → "); }

// -----------------
// 시퀀스 재생 / 반복
document.getElementById("playSeq").onclick=()=>playSequence(false);
document.getElementById("loopSeq").onclick=()=>playSequence(true);
document.getElementById("clearSeq").onclick=()=>{
  sequence=[]; renderSequence();
};
function playSequence(loop){
  let i=0;
  function next(){
    if(sequence.length===0) return;
    playChord(chordFrequencies[sequence[i]]);
    i++; if(i>=sequence.length){ if(loop) i=0; else return; }
    setTimeout(next,1800);
  }
  next();
}

// -----------------
// 이펙터 조정
document.getElementById("echoGain").oninput=e=>feedbackGain.gain.value=parseFloat(e.target.value);
document.getElementById("delayTime").oninput=e=>delayNode.delayTime.value=parseFloat(e.target.value);
document.getElementById("reverbGain").oninput=e=>reverbGain.gain.value=parseFloat(e.target.value);
document.getElementById("chorusGain").oninput=e=>chorusGain.gain.value=parseFloat(e.target.value);

// -----------------
// 간단한 파형
const canvas=document.getElementById("waveform");
const ctx=canvas.getContext("2d");
function drawWaveform(){
  requestAnimationFrame(drawWaveform);
  const data=new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(data);
  ctx.fillStyle="#14141f";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle="#00ffcc"; ctx.lineWidth=2;
  ctx.beginPath();
  let x=0; let slice=canvas.width/data.length;
  for(let i=0;i<data.length;i++){
    let y=canvas.height/2+(data[i]/128-1)*(canvas.height/4);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    x+=slice;
  }
  ctx.lineTo(canvas.width,canvas.height/2); ctx.stroke();
}
drawWaveform();