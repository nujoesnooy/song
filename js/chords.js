import {playFreq} from "./audio.js"

export const notes={
C:261.63,
D:293.66,
E:329.63,
F:349.23,
G:392,
A:440,
B:493.88
}

export let memory=[]

export function playChord(root,type){

let f=notes[root]

let intervals=[]

switch(type){

case "M":
intervals=[1,1.25,1.5]
break

case "m":
intervals=[1,1.2,1.5]
break

case "7":
intervals=[1,1.25,1.5,1.78]
break

case "M7":
intervals=[1,1.25,1.5,1.87]
break

case "m7":
intervals=[1,1.2,1.5,1.78]
break

case "sus4":
intervals=[1,1.33,1.5]
break

default:
intervals=[1,1.25,1.5]

}

intervals.forEach(i=>{

playFreq(f*i)

})

memory.push(root+type)

}

export function clearMemory(){

memory=[]

}