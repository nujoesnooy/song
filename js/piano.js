import {playFreq} from "./audio.js"

const keys="asdfghjkl;'qwertyuiop[]"

export function createPiano(){

const piano=document.getElementById("piano")

let base=261.63

for(let i=0;i<keys.length;i++){

let key=document.createElement("div")
key.className="key"

let freq=base*Math.pow(2,i/12)

key.onmousedown=()=>{
key.classList.add("active")
playFreq(freq)
}

key.onmouseup=()=>{
key.classList.remove("active")
}

piano.appendChild(key)

}

document.addEventListener("keydown",e=>{

let i=keys.indexOf(e.key)

if(i>-1){

let freq=base*Math.pow(2,i/12)
playFreq(freq)

piano.children[i].classList.add("active")

}

})

document.addEventListener("keyup",e=>{

let i=keys.indexOf(e.key)

if(i>-1){

piano.children[i].classList.remove("active")

}

})

}