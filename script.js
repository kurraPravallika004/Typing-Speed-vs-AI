const sentences = [
  "Artificial Intelligence is changing the world faster than ever before.",
  "Machine learning is shaping our future, one algorithm at a time.",
  "Neural networks mimic the brain to solve complex problems.",
  "AI doesn't sleep, it just keeps learning.",
  "The age of intelligent machines is already here.",
  "Coding is the new literacy of the digital era.",
  "Data is the oil, and AI is the engine."
];

const quoteDisplay = document.getElementById("quote-display");
const aiTypedDisplay = document.getElementById("ai-typed");
const aiSpeedDisplay = document.getElementById("ai-speed");
const input = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const wpmDisplay = document.getElementById("wpm");
const resultDiv = document.getElementById("result");

let currentSentence = "";
let startTime;
let timer;
let aiProgress = 0;
let aiSpeed; // AI chars per second
let userTypedChars = 0;
let gameRunning = false;

function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function startGame() {
  currentSentence = getRandomSentence();
  quoteDisplay.innerText = currentSentence;
  input.value = "";
  input.disabled = false;
  input.focus();

  wpmDisplay.innerText = "0";
  aiTypedDisplay.innerText = "";
  aiSpeedDisplay.innerText = "0";
  resultDiv.classList.add("hidden");
  resultDiv.innerText = "";

  startTime = Date.now();
  aiProgress = 0;
  userTypedChars = 0;
  aiSpeed = 5 + Math.random() * 7; // AI types 5-12 chars/sec

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    updateAI();
    updateWPM();
    updateAISpeedDisplay();
  }, 100);

  gameRunning = true;
}

function updateAI() {
  aiProgress += aiSpeed / 10; // update every 100ms
  if (aiProgress >= currentSentence.length) {
    aiProgress = currentSentence.length;
    aiTypedDisplay.innerText = currentSentence;
    endGame(false); // AI wins
  } else {
    aiTypedDisplay.innerText = currentSentence.substring(0, Math.floor(aiProgress));
  }
}

function updateWPM() {
  const elapsedMinutes = (Date.now() - startTime) / 60000;
  const wordsTyped = userTypedChars / 5;
  const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
  wpmDisplay.innerText = wpm;
}

function updateAISpeedDisplay() {
  // Convert chars/sec to WPM (1 word = 5 chars)
  const wpmAI = Math.round((aiSpeed * 60) / 5);
  aiSpeedDisplay.innerText = wpmAI;
}

function endGame(userWon) {
  clearInterval(timer);
  gameRunning = false;
  input.disabled = true;

  if (userWon) {
    resultDiv.innerHTML = "🏆 CONGRATS! You won the race against AI!";
    resultDiv.classList.remove("lose");
    resultDiv.classList.add("win");
  } else {
    resultDiv.innerHTML = "😂 YOU LOST! Even AI types faster than you!";
    resultDiv.classList.remove("win");
    resultDiv.classList.add("lose");
  }
  resultDiv.classList.remove("hidden");
}

// Handle typing input
input.addEventListener("input", () => {
  if (!gameRunning) return;

  userTypedChars = input.value.length;

  // Check if user finished typing sentence
  if (input.value === currentSentence) {
    endGame(true);
  }
});

// Start button click
startBtn.addEventListener("click", startGame);

// ---------------------
// 3D-style Particle Background
// ---------------------

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let particles = [];
const PARTICLE_COUNT = 120;

function randomColorHue() {
  return Math.floor(Math.random() * 360);
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * canvas.width; // for depth effect
    this.size = Math.random() * 2 + 1;
    this.speed = 0.5 + Math.random();
    this.hue = randomColorHue();
  }
  update() {
    this.z -= this.speed;
    if (this.z < 1) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.z = canvas.width;
      this.hue = randomColorHue();
    }
  }
  draw() {
    const scale = canvas.width / this.z;
    const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
    const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
    const size2d = this.size * scale;

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size2d);
    gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, 1)`);
    gradient.addColorStop(1, `hsla(${this.hue}, 100%, 70%, 0)`);
    ctx.fillStyle = gradient;
    ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animateParticles();
