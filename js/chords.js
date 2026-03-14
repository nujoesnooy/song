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

export function playChord(root){

let f=notes[root]

playFreq(f)
playFreq(f*1.25)
playFreq(f*1.5)

memory.push(root)

}

export function clearMemory(){

memory=[]

}