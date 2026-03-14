import {playChord, memory, clearMemory} from "./chords.js";
import {ctx, analyser} from "./audio.js";

// 왼쪽 코드 버튼 생성
const roots=["C","D","E","F","G","A","B"];
const types=["7","m","M","m7","M7","sus4"];
const left=document.getElementById("left");

roots.forEach(r=>{
  let row=document.createElement("div"); row.className="chordRow";
  let title=document.createElement("div"); title.className="chordTitle"; title.innerText=r;
  let buttons=document.createElement("div"); buttons.className="chordButtons";

  types.forEach(t=>{
    let b=document.createElement("button"); b.innerText=r+t;
    b.onclick=()=>playChord(r,t);
    buttons.appendChild(b);
  });

  row.appendChild(title); row.appendChild(buttons); left.appendChild(row);
});

// 피아노 생성
const piano=document.getElementById("piano");
const keyChars="asdfghjkl;'qwertyuiop[]";
let base=261.63;

for(let i=0;i<keyChars.length;i++){
  let key=document.createElement("div"); key.className="key";
  let freq=base*Math.pow(2,i/12);

  key.onmousedown=()=>{
    key.classList.add("active");
    playFreq(freq);
  };
  key.onmouseup=()=>key.classList.remove("active");

  piano.appendChild(key);
}

document.addEventListener("keydown", e=>{
  let i=keyChars.indexOf(e.key);
  if(i>-1){ playFreq(base*Math.pow(2,i/12)); piano.children[i].classList.add("active"); }
});
document.addEventListener("keyup", e=>{
  let i=keyChars.indexOf(e.key); if(i>-1) piano.children[i].classList.remove("active");
});

// 시각화
const canvas=document.getElementById("wave");
const c=canvas.getContext("2d");
canvas.width=800; canvas.height=400;

function draw(){
  requestAnimationFrame(draw);
  let data=new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(data);

  c.fillStyle="black"; c.fillRect(0,0,canvas.width,canvas.height);
  c.strokeStyle="lime"; c.beginPath();
  for(let i=0;i<data.length;i++){
    let x=i/data.length*canvas.width;
    let y=data[i]/255*canvas.height;
    if(i==0)c.moveTo(x,y); else c.lineTo(x,y);
  }
  c.stroke();
}
draw();

// 오른쪽 컨트롤
let loop=false;
document.getElementById("playBtn").onclick=async()=>{
  for(let c of memory){ playChord(c.slice(0,1),c.slice(1)); await new Promise(r=>setTimeout(r,500)); }
  if(loop)document.getElementById("playBtn").click();
};
document.getElementById("loopBtn").onclick=()=>{ loop=!loop; };
document.getElementById("clearBtn").onclick=()=>clearMemory();

// 이펙트 슬라이더
const effects=["Filter","Resonance","Reverb Amt","Chorus Amt","Attack","Release","EQ Low","EQ High"];
const effectsDiv=document.getElementById("effects");
effects.forEach(name=>{
  let e=document.createElement("div"); e.className="effect";
  let label=document.createElement("label"); label.innerText=name;
  let slider=document.createElement("input"); slider.type="range"; slider.min=0; slider.max=100; slider.value=50;
  e.appendChild(label); e.appendChild(slider); effectsDiv.appendChild(e);
});