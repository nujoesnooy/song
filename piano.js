// ===== 피아노 생성 =====
const pianoDiv=document.getElementById('pianoKeys');
const whiteNotes=['C','D','E','F','G','A','B'];
const blackNotes=['C#','D#','','F#','G#','A#',''];

whiteNotes.forEach((note,i)=>{
  const key=document.createElement('div'); key.className='pianoKey white'; key.textContent=note;
  key.onmousedown=()=>{playFreq(notes[note][0]); key.classList.add('active');}
  key.onmouseup=()=>{key.classList.remove('active');}
  pianoDiv.appendChild(key);

  if(blackNotes[i]!==''){
    const blackKey=document.createElement('div'); blackKey.className='pianoKey black'; blackKey.textContent=blackNotes[i];
    blackKey.onmousedown=()=>{playFreq(notes[whiteNotes[i]][0]*1.05946); blackKey.classList.add('active');}
    blackKey.onmouseup=()=>{blackKey.classList.remove('active');}
    pianoDiv.appendChild(blackKey);
  }
});

// 키보드 입력
const keyMap={'a':'C','s':'D','d':'E','f':'F','g':'G','h':'A','j':'B'};
document.addEventListener('keydown',e=>{if(keyMap[e.key]) playFreq(notes[keyMap[e.key]][0]);});

// OCT
document.getElementById('octUp').onclick=()=>{octave++;}
document.getElementById('octDown').onclick=()=>{octave--;}

// ===== 파형 시각화 =====
const canvas=document.getElementById('waveform');
const ctx=canvas.getContext('2d');
const analyser=audioCtx.createAnalyser();
echoGain.connect(analyser);
analyser.fftSize=2048;
const dataArray=new Uint8Array(analyser.frequencyBinCount);

function drawWaveform(){
  requestAnimationFrame(drawWaveform);
  analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle='#14141f'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.lineWidth=2; ctx.strokeStyle='#00ffd5';
  ctx.beginPath();
  let sliceWidth = canvas.width/dataArray.length;
  let x=0;
  for(let i=0;i<dataArray.length;i++){
    const v=dataArray[i]/128.0;
    const y=v*canvas.height/2;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    x+=sliceWidth;
  }
  ctx.lineTo(canvas.width,canvas.height/2);
  ctx.stroke();
}
drawWaveform();