const effects = [

"Filter",
"Resonance",
"Reverb",
"Chorus",
"Attack",
"Release",
"EQ Low",
"EQ High"

]

const effectsPanel = document.getElementById("effectsPanel")

effects.forEach(name => {

const label = document.createElement("label")

label.innerText = name

const slider = document.createElement("input")

slider.type = "range"
slider.min = 0
slider.max = 1
slider.step = 0.01

label.appendChild(slider)

effectsPanel.appendChild(label)

})