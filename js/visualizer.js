import {analyser} from "./audio.js"

export function startVisualizer(){

const canvas=document.getElementById("wave")
const c=canvas.getContext("2d")

canvas.width=800
canvas.height=400

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

if(i==0)c.moveTo(x,y)
else c.lineTo(x,y)

}

c.stroke()

}

draw()

}