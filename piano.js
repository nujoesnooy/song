const pianoDiv=document.getElementById('pianoKeys');
const keyMap={'a':'C','s':'D','d':'E','f':'F','g':'G','h':'A','j':'B'};
for(let note of Object.values(keyMap)){
  const key=document.createElement('div');
  key.className='pianoKey'; key.textContent=note;
  key.onmousedown=()=>{playFreq(notes[note][0]); key.classList.add('active');}
  key.onmouseup=()=>{key.classList.remove('active');}
  pianoDiv.appendChild(key);
}
document.addEventListener('keydown',e=>{if(keyMap[e.key]){playFreq(notes[keyMap[e.key]][0]);}});

// OCT 컨트롤
document.getElementById('octUp').onclick=()=>{octave++;}
document.getElementById('octDown').onclick=()=>{octave--;}