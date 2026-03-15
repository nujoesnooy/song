const AudioContext = window.AudioContext
const ctx = new AudioContext()

const analyser = ctx.createAnalyser()
analyser.fftSize = 2048

const filter = ctx.createBiquadFilter()
const gain = ctx.createGain()

filter.connect(gain)
gain.connect(analyser)
analyser.connect(ctx.destination)

filter.type="lowpass"

let attack=0.01
let release=1

/* SYNTH CONTROLS */

document.getElementById("filter").oninput=e=>{
filter.frequency.value=e.target.value
}

document.getElementById("attack").oninput=e=>{
attack=e.target.value
}

document.getElementById("release").oninput=e=>{
release=e.target.value
}

/* PIANO */

const notes=[261,293,329,349,392,440,493,523,587,659,698,784]

const piano=document.getElementById("piano")

notes.forEach((freq,i)=>{

let key=document.createElement("div")
key.className="key"

key.onclick=()=>play(freq)

piano.appendChild(key)

})

function play(freq){

let osc=ctx.createOscillator()
let g=ctx.createGain()

osc.frequency.value=freq
osc.type="sawtooth"

osc.connect(filter)
filter.connect(g)
g.connect(analyser)

let now=ctx.currentTime

g.gain.setValueAtTime(0,now)
g.gain.linearRampToValueAtTime(1,now+attack)
g.gain.linearRampToValueAtTime(0,now+release)

osc.start()
osc.stop(now+release)

}

/* CHORDS */

const chords=["C","D","E","F","G","A","B"]
const types=["","m","m7","M","7","sus4"]

const left=document.getElementById("left")

chords.forEach(root=>{

let row=document.createElement("div")
row.className="chordRow"

let title=document.createElement("div")
title.className="chordTitle"
title.innerText=root

row.appendChild(title)

let buttons=document.createElement("div")
buttons.className="chordButtons"

types.forEach(t=>{

let b=document.createElement("button")
b.innerText=root+t

b.onclick=()=>playChord(root)

buttons.appendChild(b)

})

row.appendChild(buttons)

left.appendChild(row)

})

function playChord(root){

let map={
C:[261,329,392],
D:[293,369,440],
E:[329,415,493],
F:[349,440,523],
G:[392,493,587],
A:[440,554,659],
B:[493,622,739]
}

map[root].forEach(n=>play(n))

}

/* VISUALIZER */

const canvas=document.getElementById("wave")
const c=canvas.getContext("2d")

canvas.width=800
canvas.height=300

function draw(){

requestAnimationFrame(draw)

let data=new Uint8Array(analyser.frequencyBinCount)
analyser.getByteTimeDomainData(data)

c.fillStyle="black"
c.fillRect(0,0,canvas.width,canvas.height)

c.strokeStyle="lime"
c.beginPath()

for(let i=0;i<data.length;i++){

let x=i/data.length*canvas.width
let y=data[i]/255*canvas.height

if(i===0)c.moveTo(x,y)
else c.lineTo(x,y)

}

c.stroke()

}

draw()