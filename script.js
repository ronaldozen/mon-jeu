const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.querySelector('.score');
const timerDisplay = document.querySelector('.timer');
const gameOverDisplay = document.querySelector('.game-over');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let stars = [];
const starSize = 20;
const starDisappearTime = 3000;
const maxStars = 50;
const gameDuration = 30; // ⏳ Durée réduite à 30 secondes
let timeLeft = gameDuration;
let gameRunning = true;

function createStar() {
  const x = Math.random() * (canvas.width - starSize);
  const y = Math.random() * (canvas.height - starSize);
  return { x, y, disappearAt: Date.now() + starDisappearTime };
}

function drawStar(star) {
  context.beginPath();
  context.arc(star.x + starSize / 2, star.y + starSize / 2, starSize / 2, 0, Math.PI * 2);
  context.fillStyle = 'yellow';
  context.fill();
  context.closePath();
}

function updateStars() {
  const now = Date.now();
  stars = stars.filter(star => star.disappearAt > now);
  while (stars.length < maxStars) {
    stars.push(createStar());
  }
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    drawStar(star);
  }
}

function gameLoop() {
  if (!gameRunning) return;
  updateStars();
  draw();
  requestAnimationFrame(gameLoop);
}

function handleMouseClick(event) {
  if (!gameRunning) return;
  
  const x = event.clientX;
  const y = event.clientY;

  let found = false;
  stars = stars.filter(star => {
    const dx = x - (star.x + starSize / 2);
    const dy = y - (star.y + starSize / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < starSize / 2) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      found = true;
      return false;
    }
    return true;
  });

  if (found) {
    stars.push(createStar());
  }
}

function updateTimer() {
  if (!gameRunning) return;
  timeLeft--;
  timerDisplay.textContent = `Temps: ${timeLeft}s`;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  gameOverDisplay.style.display = 'block';
}

canvas.addEventListener('click', handleMouseClick);

for (let i = 0; i < maxStars; i++) {
  stars.push(createStar());
}

gameLoop();
setInterval(updateTimer, 1000);
