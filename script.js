document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 20; //
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
    }
    if (blownOut > 0) {
  updateCandleCount();

  // 🟣 Make the phone vibrate
  if (navigator.vibrate) {
    navigator.vibrate(300); // vibrates for 0.3s
  }

  // 🎉 Confetti effect
  const confettiCount = 150;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
   const colors = ["#0E112A", "#060505", "#4A4E69", "#1B1B2F", "#9AA0A6"];
confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(confetti);

    // Remove confetti after animation
    setTimeout(() => confetti.remove(), 4000);
  }
}

  }
// ---- mic bootstrap via user gesture ----
function startBlowDetection(stream) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioContext.createAnalyser();
  microphone = audioContext.createMediaStreamSource(stream);
  analyser.fftSize = 256;
  microphone.connect(analyser);

  // keep your existing blow check timing
  setInterval(blowOutCandles, 200);
}

const startMicButton = document.getElementById('startMic');
if (startMicButton && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  startMicButton.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startMicButton.classList.add('hidden'); // hide the button
      startBlowDetection(stream);
      console.log('🎤 mic active');
    } catch (err) {
      console.error('Mic permission error:', err);
      alert('Please allow microphone access to blow the candle 🎂');
    }
  });
} else {
  console.log('getUserMedia not supported on this browser');
}

 
