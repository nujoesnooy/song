const pianoDiv = document.getElementById("pianoKeys")

const whiteNotes = ["C","D","E","F","G","A","B"]

whiteNotes.forEach(note => {

const key = document.createElement("div")

key.className = "pianoKey"
key.innerText = note

key.onclick = () => {

playFreq(baseNotes[note])

}

pianoDiv.appendChild(key)

})

document.addEventListener("keydown", e => {

const map = {

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

document.getElementById("octUp").onclick = ()=> octave++
document.getElementById("octDown").onclick = ()=> octave--