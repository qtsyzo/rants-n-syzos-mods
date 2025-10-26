(() => {
  const STORAGE_KEY = 'syzohalloween_sound';
  const AMBIENT_SRC = 'assets/coast-162.mp3';
  const WHOOSH_SRC = 'assets/whoosh.mp3';

  // --- Audio setup ---
  let ambient = document.getElementById('ambientAudioShared');
  if (!ambient) {
    ambient = document.createElement('audio');
    ambient.id = 'ambientAudioShared';
    ambient.loop = true;
    ambient.src = AMBIENT_SRC;
    document.body.appendChild(ambient);
  }

  let whoosh = document.getElementById('whooshAudioShared');
  if (!whoosh) {
    whoosh = document.createElement('audio');
    whoosh.id = 'whooshAudioShared';
    whoosh.src = WHOOSH_SRC;
    document.body.appendChild(whoosh);
  }

  // --- Sound button ---
  if (!document.querySelector('.sound-btn')) {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.textContent = '🔊';
    document.body.appendChild(btn);
  }
  const soundBtn = document.querySelector('.sound-btn');

  function updateBtn(on) {
    soundBtn.textContent = on ? '🔊' : '🔇';
  }

  let audioOn = localStorage.getItem(STORAGE_KEY) === '1';
  function setAudio(on) {
    audioOn = !!on;
    localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    updateBtn(on);
    if (on) ambient.play().catch(() => {});
    else ambient.pause();
  }
  soundBtn.addEventListener('click', () => setAudio(!audioOn));
  document.addEventListener('DOMContentLoaded', () => {
    updateBtn(audioOn);
    if (audioOn) ambient.play().catch(() => {});
  });

  // --- Modal setup ---
  let modal = document.getElementById('modalOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalOverlay';
    modal.innerHTML = `
      <div class="confirm-wrap" role="dialog" aria-modal="true">
        <div class="fog-portal" aria-hidden="true">
          <div class="alert-mark">!</div>
        </div>
        <div id="confirmTitle" class="confirm-title">Are you sure this is the correct file?</div>
        <div class="confirm-text">
          You’re about to download: <strong class="file-name">Unknown File</strong><br>
          Click <strong>Yes</strong> to confirm and start the download, or <strong>No</strong> to cancel.
        </div>
        <div class="modal-actions">
          <button class="modal-btn yes">Yes</button>
          <button class="modal-btn no">No</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const style = document.createElement('style');
    style.textContent = `
      #modalOverlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.75);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }
      .confirm-wrap {
        background: #1a1a1a;
        border: 2px solid #ff7a18;
        border-radius: 10px;
        padding: 30px;
        color: #fff;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 0 25px rgba(255,122,24,0.4);
      }
      .fog-portal {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        font-size: 3rem;
        color: #ff7a18;
        text-shadow: 0 0 15px rgba(255,122,24,0.8);
      }
      .alert-mark {
        animation: pulseAlert 1.4s infinite;
        font-weight: 700;
      }
      @keyframes pulseAlert {
        0%,100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
      }
      .modal-actions {
        margin-top: 15px;
        display: flex;
        gap: 15px;
        justify-content: center;
      }
      .modal-btn {
        background: #ff7a18;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
      }
      .modal-btn.no { background: #444; color: #fff; }
      .modal-btn:hover { filter: brightness(1.1); }
    `;
    document.head.appendChild(style);
  }

  const yesBtn = modal.querySelector('.modal-btn.yes');
  const noBtn = modal.querySelector('.modal-btn.no');
  const fileNameEl = modal.querySelector('.file-name');
  let pendingHref = null;

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
    pendingHref = null;
  });

  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!pendingHref) return (modal.style.display = 'none');
    whoosh.play().catch(() => {});
    setTimeout(() => {
      window.location.href = pendingHref;
      modal.style.display = 'none';
      pendingHref = null;
    }, 1000);
  });

  // --- Interceptors ---
  function attachInterceptors(scope) {
    const links = (scope || document).querySelectorAll('a.game-link');
    links.forEach((a) => {
      if (a.dataset.hook === '1') return;
      a.dataset.hook = '1';
      a.addEventListener('click', function (ev) {
        // Only intercept left clicks (not ctrl/shift clicks)
        if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;

        // Only intercept same-tab links (no target="_blank")
        if (this.target && this.target === '_blank') return;

        ev.preventDefault();

        // Set file name for display
        const title = this.querySelector('.game-title')?.textContent?.trim() || 'Unknown File';
        fileNameEl.textContent = title;

        pendingHref = this.href;
        modal.style.display = 'flex';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => attachInterceptors(document));
  window.SyzoHalloween = { attachInterceptors };
})();
