// F.E. global variable with fft data
interface Window {
  fftData: Uint8Array;
}

function setupFFTAnalysis() {
  const audio: HTMLAudioElement = document.getElementById(
    "audio"
  )! as HTMLAudioElement;
  audio.autoplay = true;

  // FFT settings
  const ctx = new window.AudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  const data = new Uint8Array(analyser.frequencyBinCount);
  let audioReady = false;
  audio.addEventListener("play", async () => {
    await ctx.resume(); // unlock AudioContext on user gesture
    if (!audioReady) {
      // connect only once
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioReady = true;
    }
  });
  
  // do fft analysis each frame
  function renderLoop() {
    if (audioReady) {
      console.log("FFT data length:", data.length);
      analyser.getByteFrequencyData(data);
    }
    requestAnimationFrame(renderLoop);
  }

  // f.e. global variable
  window.fftData = data;
  renderLoop();
}
