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
      f.y += Math.pow(f.d, 2) + 1;
      f.x += Math.sin(angle) * 0.5;
      if (f.y > canvas.height) {
        f.y = 0;
        f.x = Math.random() * canvas.width;
      }
    }
  }

  (function animate() {
    drawSnow();
    requestAnimationFrame(animate);
  })();

  // 🔊 Sound Toggle
  const btn = document.getElementById('soundToggle');
  const audio = document.getElementById('background-audio');
  let on = false;

  // 👇 set correct default icon (muted)
  btn.textContent = '🔇';

  btn.addEventListener('click', () => {
    on = !on;
    btn.textContent = on ? '🔊' : '🔇';
    if (on) audio.play();
    else audio.pause();
  });
})();

// ❄️ Custom "Are you sure?" popup for real downloads (not page links)
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.createElement("div");
  popup.className = "confirm-popup hidden";
  popup.innerHTML = `
    <div class="confirm-box">
      <h3>❄️ Confirm Download</h3>
      <p>Are you sure this is the right file?</p>
      <div class="confirm-buttons">
        <button id="confirm-yes">Yes</button>
        <button id="confirm-no">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  let pendingLink = null;

  const downloadLinks = document.querySelectorAll(
    'a[href*="gofile.io"], a[href*="mediafire.com"], a[href*="mega.nz"], a[href$=".apk"], a[href$=".obb"], a[href$=".zip"], a[href$=".dat"]'
  );

  downloadLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (
        href === "/" ||
        href.includes("/apks") ||
        href.includes("/metadatas") ||
        href.includes("/obbs")
      ) return;

      e.preventDefault();
      pendingLink = link;
      popup.classList.remove("hidden");
    });
  });

  document.getElementById("confirm-yes").addEventListener("click", () => {
    popup.classList.add("hidden");
    if (pendingLink) window.open(pendingLink.href, "_blank");
  });

  document.getElementById("confirm-no").addEventListener("click", () => {
    popup.classList.add("hidden");
    pendingLink = null;
  });
});
