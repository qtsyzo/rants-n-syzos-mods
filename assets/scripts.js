// --- Background Audio Toggle ---
const audio = document.getElementById('background-audio');
const toggleBtn = document.getElementById('soundToggle');
let isPlaying = false;

// Restore sound state
if (localStorage.getItem('sound') === 'on') {
  audio.play();
  isPlaying = true;
  toggleBtn.textContent = '🔊';
}

toggleBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    toggleBtn.textContent = '🔇';
    localStorage.setItem('sound', 'off');
  } else {
    audio.play();
    toggleBtn.textContent = '🔊';
    localStorage.setItem('sound', 'on');
  }
  isPlaying = !isPlaying;
});

// --- Fog Confirmation Modal ---
document.querySelectorAll('.game-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const url = link.getAttribute('href');
    showFogModal(url);
  });
});

function showFogModal(targetUrl) {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'modalOverlay';
  overlay.style.cssText = `
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:rgba(32,32,32,0.55);backdrop-filter:blur(3px);z-index:1200;
    animation:fadeIn 0.3s ease-out forwards;
  `;

  // Modal window
  const modal = document.createElement('div');
  modal.className = 'confirm-wrap';
  modal.innerHTML = `
    <div class="fog-portal"></div>
    <div class="confirm-title">Are you sure this is the correct file?</div>
    <div class="modal-actions">
      <button class="modal-btn yes">Yes</button>
      <button class="modal-btn no">No</button>
    </div>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Sound effect (optional whoosh)
  const whoosh = new Audio('assets/whoosh.mp3');
  whoosh.volume = 0.5;
  whoosh.play().catch(()=>{});

  // Button events
  modal.querySelector('.yes').addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 1s ease-in forwards';
    setTimeout(() => {
      window.open(targetUrl, '_blank');
      overlay.remove();
    }, 1000);
  });

  modal.querySelector('.no').addEventListener('click', () => {
    overlay.style.animation = 'fadeOut 1s ease-in forwards';
    setTimeout(() => overlay.remove(), 1000);
  });
}

// --- Keyframes for fog fade ---
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
@keyframes fadeOut { from {opacity:1;} to {opacity:0;} }
`;
document.head.appendChild(style);
