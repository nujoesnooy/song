const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let octave=4;

// 이펙터 노드
const echo = audioCtx.createDelay(); echo.delayTime.value=0.25;
const echoGain = audioCtx.createGain(); echoGain.gain.value=0.4;
echo.connect(echoGain).connect(audioCtx.destination);

// 코드 정의
const notes = {C:[261.63,329.63,392],D:[293.66,369.99,440],E:[329.63,415.3,493.88],
F:[349.23,440,523.25],G:[392,493.88,587.33],A:[440,554.37,659.25],B:[493.88,622.25,739.99]};

function playFreq(freq,duration=1){
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.frequency.value=freq*(2**(octave-4));
  osc.type="sine";
  osc.connect(gain); gain.connect(echo).connect(echoGain);
  gain.gain.setValueAtTime(0.3,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);
  osc.start(); osc.stop(audioCtx.currentTime+duration);
}

function playChord(freqs){ freqs.forEach(f=>playFreq(f,1.5)); }

// 시퀀스
let sequence=[]; let loop=false;
const sequenceDiv=document.getElementById('sequence');
function renderSequence(){ sequenceDiv.textContent=sequence.join(" → "); }
document.getElementById('clearSeq').onclick=()=>{sequence=[];renderSequence();}
document.getElementById('playSeq').onclick=playSequence;
document.getElementById('loopSeq').onclick=()=>{loop=!loop;playSequence();}
function playSequence(){
  if(sequence.length===0) return;
  let i=0;
  function next(){
    playChord(notes[sequence[i]]);
    i++; if(i>=sequence.length){if(loop){i=0;setTimeout(next,1500);} return;}
    setTimeout(next,1500);
  }
  next();
}

// 왼쪽 코드 버튼 생성
const chordGroups=['C','D','E','F','G','A','B'];
const chordButtonsDiv=document.getElementById('chordButtons');
chordGroups.forEach(g=>{
  const div=document.createElement('div');
  div.className='chord-group';
  const groupName=document.createElement('div'); groupName.textContent=g; div.appendChild(groupName);
  ['','7','m','m7','M7','sus4'].forEach(s=>{
    const btn=document.createElement('button'); btn.textContent=g+s; 
    btn.onclick=()=>{
      playChord(notes[g]);
      sequence.push(g);
      renderSequence();
    }
    div.appendChild(btn);
  });
  chordButtonsDiv.appendChild(div);
});