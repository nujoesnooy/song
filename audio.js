// ===== Audio Context =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let octave = 4;

// 이펙터 기본
const echo = audioCtx.createDelay();
echo.delayTime.value = 0.25;
const echoGain = audioCtx.createGain();
echoGain.gain.value = 0.4;
echo.connect(echoGain).connect(audioCtx.destination);

// 코드 정의
const notes = {
  C:[261.63,329.63,392], D:[293.66,369.99,440], E:[329.63,415.3,493.88],
  F:[349.23,440,523.25], G:[392,493.88,587.33], A:[440,554.37,659.25], B:[493.88,622.25,739.99]
};

// 시퀀스
let sequence=[], loop=false;
const sequenceDiv=document.getElementById('sequence');

function playFreq(freq,duration=1){
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.frequency.value=freq*(2**(octave-4));
  osc.type='sine';
  osc.connect(gain); gain.connect(echo).connect(echoGain);
  gain.gain.setValueAtTime(0.3,audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+duration);
  osc.start(); osc.stop(audioCtx.currentTime+duration);
}

function playChord(freqs){ freqs.forEach(f=>playFreq(f,1.5)); }

function addSequence(note){ sequence.push(note); renderSequence(); }
function renderSequence(){ sequenceDiv.textContent = sequence.join(' → '); }

document.getElementById('clearSeq').onclick = ()=>{sequence=[]; renderSequence();}
document.getElementById('playSeq').onclick = playSequence;
document.getElementById('loopSeq').onclick = ()=>{loop=!loop; playSequence();};

function playSequence(){
  if(sequence.length===0) return;
  let i=0;
  function next(){
    playChord(notes[sequence[i]]);
    i++; if(i>=sequence.length){if(loop){i=0; setTimeout(next,1500);} return;}
    setTimeout(next,1500);
  }
  next();
}

// 왼쪽 코드 버튼 생성
const chordGroups=['C','D','E','F','G','A','B'];
const chordSuffixes=['','7','m','m7','M7','sus4'];
const chordPanel=document.getElementById('chordPanel');

chordGroups.forEach(g=>{

  const div=document.createElement('div');
  div.className='chord-group';

  const groupName=document.createElement('div');
  groupName.className='group-name';
  groupName.textContent=g;
  div.appendChild(groupName);

  const btnRow=document.createElement('div');
  btnRow.className='group-buttons';

  chordSuffixes.forEach(s=>{

    const btn=document.createElement('button');
    btn.textContent=g+s;

    btn.onclick=()=>{

      const root=notes[g][0];

      const chord = buildChord(root,s);

      playChord(chord);

      addSequence(g+s);
    }

    btnRow.appendChild(btn);
  });

  div.appendChild(btnRow);
  chordPanel.appendChild(div);

});

// 코드 타입별 음 계산
function buildChord(rootFreq, type){

  const semi = Math.pow(2,1/12); // 반음 계산

  const majorThird = rootFreq * Math.pow(semi,4);
  const minorThird = rootFreq * Math.pow(semi,3);

  const fifth = rootFreq * Math.pow(semi,7);
  const minorSeventh = rootFreq * Math.pow(semi,10);
  const majorSeventh = rootFreq * Math.pow(semi,11);
  const susFourth = rootFreq * Math.pow(semi,5);

  switch(type){

    case "":
      return [rootFreq, majorThird, fifth];

    case "m":
      return [rootFreq, minorThird, fifth];

    case "7":
      return [rootFreq, majorThird, fifth, minorSeventh];

    case "m7":
      return [rootFreq, minorThird, fifth, minorSeventh];

    case "M7":
      return [rootFreq, majorThird, fifth, majorSeventh];

    case "sus4":
      return [rootFreq, susFourth, fifth];

    default:
      return [rootFreq, majorThird, fifth];
  }
}

// 이펙터 슬라이더
const effects=['Filter','Resonance','Reverb Amt','Chorus Amt','Attack','Release','EQ Low','EQ High'];
const effectsDiv=document.getElementById('effects');
effects.forEach(eff=>{
  const label=document.createElement('label');
  label.textContent=eff;
  const slider=document.createElement('input'); slider.type='range'; slider.min=0; slider.max=1; slider.step=0.01;
  label.appendChild(slider);
  effectsDiv.appendChild(label);
});