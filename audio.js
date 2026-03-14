const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

let octave = 4

const masterGain = audioCtx.createGain()
masterGain.gain.value = 0.5
masterGain.connect(audioCtx.destination)

const analyser = audioCtx.createAnalyser()
masterGain.connect(analyser)

function playFreq(freq, duration = 1) {

const osc = audioCtx.createOscillator()
const gain = audioCtx.createGain()

osc.type = "sine"

osc.frequency.value = freq * Math.pow(2, octave - 4)

osc.connect(gain)
gain.connect(masterGain)

gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

osc.start()
osc.stop(audioCtx.currentTime + duration)

}

function playChord(freqs){

freqs.forEach(f => playFreq(f,1.5))

}

const baseNotes = {

C:261.63,
D:293.66,
E:329.63,
F:349.23,
G:392.00,
A:440.00,
B:493.88

}