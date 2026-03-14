const canvas = document.getElementById("waveform")
const ctx = canvas.getContext("2d")

canvas.width = 800
canvas.height = 300

const buffer = new Uint8Array(analyser.frequencyBinCount)

function draw(){

requestAnimationFrame(draw)

analyser.getByteTimeDomainData(buffer)

ctx.fillStyle = "#111"
ctx.fillRect(0,0,canvas.width,canvas.height)

ctx.lineWidth = 2
ctx.strokeStyle = "#00ffd5"

ctx.beginPath()

let slice = canvas.width / buffer.length
let x = 0

for(let i=0;i<buffer.length;i++){

let v = buffer[i] / 128
let y = v * canvas.height/2

if(i===0){

ctx.moveTo(x,y)

}else{

ctx.lineTo(x,y)

}

x += slice

}

ctx.stroke()

}

draw()