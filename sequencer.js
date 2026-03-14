let sequence=[]
let loop=false

const sequenceDiv=document.getElementById("sequence")

function addSequence(chord){

sequence.push(chord)

renderSequence()

}

function renderSequence(){

sequenceDiv.innerText="Sequence : "+sequence.length+" chords"

}

document.getElementById("clearSeq").onclick=()=>{

sequence=[]
renderSequence()

}

document.getElementById("loopSeq").onclick=()=>{

loop=!loop

}

document.getElementById("playSeq").onclick=playSequence

function playSequence(){

if(sequence.length===0)return

let i=0

function next(){

playChord(sequence[i])

i++

if(i>=sequence.length){

if(loop){

i=0
setTimeout(next,1500)

}

return

}

setTimeout(next,1500)

}

next()

}
