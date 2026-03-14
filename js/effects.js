export function createEffects(){

const effects=[
"Filter","Resonance","Reverb Amt","Chorus Amt",
"Attack","Release","EQ Low","EQ High"
]

const container=document.getElementById("effects")

effects.forEach(name=>{

let div=document.createElement("div")
div.className="effect"

let label=document.createElement("div")
label.innerText=name

let slider=document.createElement("input")
slider.type="range"
slider.min=0
slider.max=100
slider.value=50

div.appendChild(label)
div.appendChild(slider)

container.appendChild(div)

})

}