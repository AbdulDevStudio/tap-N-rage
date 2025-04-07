const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const birdSelector = document.getElementById('birdSelector');

let bird, poles, poleWidth, gap, frame, score, highScore = 0, gameOver, selectedEmoji = birdSelector.value;

birdSelector.addEventListener('change', () => {
  selectedEmoji = birdSelector.value;
  initGame();
});

function initGame() {
  bird = { x: 50, y: 150, width: 30, height: 30, gravity: 0.6, lift: -10, velocity: 0 };
  poles = [];
  poleWidth = 60;
  gap = 160;
  frame = 0;
  score = 0;
  gameOver = false;
  restartBtn.style.display = 'none';
  requestAnimationFrame(gameLoop);
}

function drawBird() {
  ctx.font = '28px Poppins';
  ctx.textAlign = 'left';
  ctx.fillText(selectedEmoji, bird.x, bird.y + bird.height);
}

function drawPoles() {
  ctx.fillStyle = '#4caf50';
  poles.forEach(p => {
    ctx.fillRect(p.x, 0, poleWidth, p.top);
    ctx.fillRect(p.x, p.top + gap, poleWidth, canvas.height);
  });
}

function updatePoles() {
  if (frame % 90 === 0) {
    let topHeight = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
    poles.push({ x: canvas.width, top: topHeight, passed: false });
  }

  poles.forEach(p => {
    p.x -= 2;
    if (!p.passed && bird.x > p.x + poleWidth) {
      score++;
      p.passed = true;
      if (score > highScore) highScore = score;
    }
  });

  poles = poles.filter(p => p.x + poleWidth > 0);
}

function checkCollision() {
  for (let p of poles) {
    if (
      bird.x < p.x + poleWidth &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > p.top + gap)
    ) {
      gameOver = true;
    }
  }
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }
}

function drawScore() {
  ctx.fillStyle = '#212121';
  ctx.font = 'bold 24px Poppins';
  ctx.fillText('🎯 Score: ' + score, 20, 35);
  ctx.fillText('🏆 High Score: ' + highScore, 20, 70);
}

function drawGameOver() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(40, 200, 320, 200);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 200, 320, 200);

  ctx.font = 'bold 36px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText('💀 Game Over 💀', canvas.width / 2, 250);

  ctx.font = '22px Poppins';
  ctx.fillStyle = '#ffeb3b';
  ctx.fillText('Final Score: ' + score, canvas.width / 2, 295);
  ctx.fillText('High Score: ' + highScore, canvas.width / 2, 330);

  ctx.font = '18px Poppins';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Click Restart to Play Again', canvas.width / 2, 370);

  restartBtn.style.display = 'inline-block';
}

function gameLoop() {
  if (gameOver) {
    drawGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();
  updatePoles();
  drawPoles();
  drawScore();
  checkCollision();

  frame++;
  requestAnimationFrame(gameLoop);
}

function flap() {
  bird.velocity = bird.lift;
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') flap();
});

canvas.addEventListener('mousedown', flap);
restartBtn.addEventListener('click', initGame);

initGame();
