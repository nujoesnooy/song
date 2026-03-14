const pianoDiv=document.getElementById("pianoKeys")

const notes=["C","D","E","F","G","A","B"]

notes.forEach(n=>{

const key=document.createElement("div")

key.className="pianoKey"

key.innerText=n

key.onclick=()=>{

playFreq(baseNotes[n])

}

pianoDiv.appendChild(key)

})

document.addEventListener("keydown",e=>{

const map={
a:"C",
s:"D",
d:"E",
f:"F",
g:"G",
h:"A",
j:"B"
}

if(map[e.key]){

playFreq(baseNotes[map[e.key]])

}

})

document.getElementById("octUp").onclick=()=>octave++
document.getElementById("octDown").onclick=()=>octave--
