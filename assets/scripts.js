// 🎄 Snow animation + sound control
(() => {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let snowflakes = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Create snowflakes
  for (let i = 0; i < 120; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      d: Math.random() + 0.5
    });
  }

  let angle = 0;

  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.beginPath();
    for (let f of snowflakes) {
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    }
    ctx.fill();
    moveSnow();
  }

  function moveSnow() {
    angle += 0.01;
    for (let f of snowflakes) {
      f.y += Math.pow(f.d, 2) + 1; // fall speed
      f.x += Math.sin(angle) * 0.5; // slight side drift
      if (f.y > canvas.height) {
        f.y = 0;
        f.x = Math.random() * canvas.width;
      }
    }
  }

  // Animation loop
  (function animate() {
    drawSnow();
    requestAnimationFrame(animate);
  })();

  // 🔊 Sound Toggle
  const btn = document.getElementById('soundToggle');
  const audio = document.getElementById('background-audio');
  let on = false;

  // 👇 Default icon = muted
  btn.textContent = '🔇';

  btn.addEventListener('click', () => {
    on = !on;
    btn.textContent = on ? '🔊' : '🔇';
    if (on) audio.play();
    else audio.pause();
  });
})();
