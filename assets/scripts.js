// 🎅 Version badge control
document.addEventListener("DOMContentLoaded", () => {
  const versionBadge = document.getElementById("version-badge");
  if (!versionBadge) return;

  // current version
  let version = "1.0.0";

  // helper → bump patch (0.0.1)
  function bumpVersion(v) {
    const parts = v.split(".").map(Number);
    parts[2]++;
    return parts.join(".");
  }

  // get last version from localStorage
  const stored = localStorage.getItem("syzohub_version");
  if (stored) {
    version = bumpVersion(stored);
  }

  // update display & store new version
  versionBadge.textContent = "v" + version;
  localStorage.setItem("syzohub_version", version);
});
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
// ❄️ Custom "Are you sure?" popup for real downloads (not page links)
document.addEventListener("DOMContentLoaded", () => {
  // Create popup container
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

  // Only target external file links (like gofile, mediafire, etc.)
  const downloadLinks = document.querySelectorAll('a[href*="gofile.io"], a[href*="mediafire.com"], a[href*="mega.nz"], a[href$=".apk"], a[href$=".obb"], a[href$=".zip"], a[href$=".dat"]');

  downloadLinks.forEach(link => {
    link.addEventListener("click", e => {
      // Skip internal links (like index.html, apks.html, etc.)
      const href = link.getAttribute("href");
      if (
        href.includes("index.html") ||
        href.includes("apks.html") ||
        href.includes("metadatas.html") ||
        href.includes("obbs.html")
      ) return;

      e.preventDefault();
      pendingLink = link;
      popup.classList.remove("hidden");
    });
  });

  // Handle Yes / No
  document.getElementById("confirm-yes").addEventListener("click", () => {
    popup.classList.add("hidden");
    if (pendingLink) window.open(pendingLink.href, "_blank");
  });

  document.getElementById("confirm-no").addEventListener("click", () => {
    popup.classList.add("hidden");
    pendingLink = null;
  });
});
