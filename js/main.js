import {playChord,memory,clearMemory} from "./chords.js"
import {createPiano} from "./piano.js"
import {createEffects} from "./effects.js"
import {startVisualizer} from "./visualizer.js"

const roots=["C","D","E","F","G","A","B"]
const types=["7","m","m7","M7"]

const left=document.getElementById("left")

roots.forEach(r=>{

let row=document.createElement("div")
row.className="chordRow"

let title=document.createElement("div")
title.className="chordTitle"
title.innerText=r

let buttons=document.createElement("div")
buttons.className="chordButtons"

types.forEach(t=>{

let b=document.createElement("button")
b.innerText=r+t

b.onclick=()=>playChord(r)

buttons.appendChild(b)

})

row.appendChild(title)
row.appendChild(buttons)

left.appendChild(row)

})

createPiano()

createEffects()

startVisualizer()

let loop=false

document.getElementById("playBtn").onclick=async()=>{

for(let c of memory){

playChord(c)

await new Promise(r=>setTimeout(r,500))

}

if(loop)document.getElementById("playBtn").click()

}

document.getElementById("loopBtn").onclick=()=>{

loop=!loop

}

document.getElementById("clearBtn").onclick=()=>{

clearMemory()

}