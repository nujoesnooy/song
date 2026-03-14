export const AudioContextClass = window.AudioContext || window.webkitAudioContext;
export const ctx = new AudioContextClass();
export const analyser = ctx.createAnalyser();
analyser.connect(ctx.destination);

export function playFreq(freq){
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(analyser);
  gain.gain.setValueAtTime(.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.3, ctx.currentTime+.01);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.6);
  osc.start();
  osc.stop(ctx.currentTime+.6);
}