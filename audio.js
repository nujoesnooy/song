const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

let octave = 4

const analyser = audioCtx.createAnalyser()

const masterGain = audioCtx.createGain()
masterGain.gain.value = 0.5

masterGain.connect(analyser)
analyser.connect(audioCtx.destination)

function playFreq(freq,duration=1){

const osc = audioCtx.createOscillator()
const gain = audioCtx.createGain()

osc.type="sine"

osc.frequency.value = freq*Math.pow(2,octave-4)

osc.connect(gain)
gain.connect(masterGain)

gain.gain.setValueAtTime(0.3,audioCtx.currentTime)

gain.gain.exponentialRampToValueAtTime(
0.001,
audioCtx.currentTime+duration
)

osc.start()
osc.stop(audioCtx.currentTime+duration)

}

function playChord(freqs){

freqs.forEach(f=>playFreq(f,1.5))

}

const baseNotes={
C:261.63,
D:293.66,
E:329.63,
F:349.23,
G:392,
A:440,
B:493.88
}

/* ======================
코드 버튼 생성
====================== */

const chordPanel = document.getElementById("chordPanel")

const chords = ["C","D","E","F","G","A","B"]

chords.forEach(chord=>{

const btn = document.createElement("button")

btn.className="chordBtn"

btn.innerText = chord

btn.onclick = ()=>{

const freq = baseNotes[chord]

playChord([

freq,
freq*1.25,
freq*1.5

])

addSequence([

freq,
freq*1.25,
freq*1.5

])

}

chordPanel.appendChild(btn)

})
