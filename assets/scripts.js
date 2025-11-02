// Shared Winter JS — confirmation modal, audio control, snow flair
(() => {
  const STORAGE_KEY = 'syzosnow_sound';
  const AMBIENT_SRC = 'assets/coast-162.mp3';
  const WHOOSH_SRC = 'assets/whoosh.mp3';

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

  if (!document.querySelector('.sound-btn')) {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    document.body.appendChild(btn);
  }

  const soundBtn = document.querySelector('.sound-btn');
  function updateBtn(on) { soundBtn.textContent = on ? '🔊' : '🔇'; }

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

  // 🎄 Frosty Confirmation Modal
  let modal = document.getElementById('modalOverlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalOverlay';
    modal.innerHTML = `
      <div class="confirm-wrap" role="dialog" aria-modal="true">
        <div class="snow-alert">❄️</div>
        <div id="confirmTitle" class="confirm-title">Confirm Download?</div>
        <div class="confirm-text">
          You’re about to download: <strong class="file-name">Unknown File</strong><br>
          Click <strong>Yes</strong> to start the download, or <strong>No</strong> to cancel.
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
        background: rgba(240,248,255,0.85);
        z-index: 10000;
        align-items: center;
        justify-content: center;
      }
      .confirm-wrap {
        background: linear-gradient(180deg,#fff,#e0f7ff);
        border: 2px solid #7dd3fc;
        border-radius: 10px;
        padding: 30px;
        color: #033e59;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 0 25px rgba(173,216,230,0.7);
      }
      .snow-alert {
        font-size: 2.8rem;
        margin-bottom: 8px;
        animation: spinSnow 3s linear infinite;
      }
      @keyframes spinSnow {
        0% { transform: rotate(0); }
        100% { transform: rotate(360deg); }
      }
      .confirm-title {
        font-weight: 700;
        color: #0284c7;
        margin-bottom: 10px;
      }
      .modal-actions {
        margin-top: 15px;
        display: flex;
        gap: 15px;
        justify-content: center;
      }
      .modal-btn {
        background: linear-gradient(to bottom,#60a5fa,#2563eb);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 14px;
        cursor: pointer;
        transition: background .2s;
      }
      .modal-btn:hover {
        background: linear-gradient(to bottom,#93c5fd,#3b82f6);
      }
    `;
    document.head.appendChild(style);
  }

  const yesBtn = modal.querySelector('.yes');
  const noBtn = modal.querySelector('.no');
  let confirmCallback = null;

  yesBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    if (confirmCallback) confirmCallback();
  });
  noBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  function showModal(fileName, onConfirm) {
    modal.querySelector('.file-name').textContent = fileName;
    confirmCallback = onConfirm;
    modal.style.display = 'flex';
    whoosh.play().catch(() => {});
  }

  window.SyzoSnow = {
    attachInterceptors() {
      document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.dataset.snowbound) {
          link.dataset.snowbound = '1';
          link.addEventListener('click', e => {
            const text = link.querySelector('.game-title')?.textContent || link.href;
            e.preventDefault();
            showModal(text, () => window.open(link.href, '_blank'));
          });
        }
      });
    }
  };
})();
