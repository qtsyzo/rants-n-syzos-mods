// Shared Halloween JS: ambient audio, fog confirmation modal, download interceptors, and sound toggle.
(() => {
  const STORAGE_KEY = 'syzohalloween_sound';
  const AMBIENT_SRC = 'assets/coast-162.mp3'; // background loop file
  const WHOOSH_SRC  = 'assets/whoosh.mp3';    // optional whoosh for modal

  // Ambient audio element
  let ambient = document.getElementById('ambientAudioShared');
  if(!ambient){
    ambient = document.createElement('audio');
    ambient.id = 'ambientAudioShared';
    ambient.loop = true;
    ambient.preload = 'auto';
    ambient.src = AMBIENT_SRC;
    document.body.appendChild(ambient);
  }

  // Optional whoosh
  let whoosh = document.getElementById('whooshAudioShared');
  if(!whoosh){
    whoosh = document.createElement('audio');
    whoosh.id = 'whooshAudioShared';
    whoosh.preload = 'auto';
    whoosh.src = WHOOSH_SRC;
    document.body.appendChild(whoosh);
  }

  // Bottom-right sound button
  if(!document.querySelector('.sound-btn')){
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.setAttribute('aria-pressed','false');
    document.body.appendChild(btn);
  }
  const soundBtn = document.querySelector('.sound-btn');

  function updateBtn(on){
    soundBtn.textContent = on ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-pressed', String(on));
  }

  let audioOn = localStorage.getItem(STORAGE_KEY) === '1';
  function setAudio(on){
    audioOn = !!on;
    localStorage.setItem(STORAGE_KEY, audioOn ? '1' : '0');
    updateBtn(audioOn);
    if(audioOn){
      ambient.play().catch(()=>{});
    } else {
      ambient.pause();
      try{ ambient.currentTime = 0; }catch(e){}
    }
  }
  soundBtn.addEventListener('click', ()=> setAudio(!audioOn));

  document.addEventListener('DOMContentLoaded', ()=>{
    updateBtn(audioOn);
    if(audioOn) ambient.play().catch(()=>{});
  });

  // Build confirmation modal once
  let modal = document.getElementById('modalOverlay');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'modalOverlay';
    modal.innerHTML = `
      <div class="confirm-wrap" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
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

    // 🎨 Add styling for the exclamation mark
    const style = document.createElement('style');
    style.textContent = `
      .fog-portal {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: #ff7a18;
        text-shadow: 0 0 10px rgba(255,122,24,0.6);
      }
      .alert-mark {
        font-family: "Poppins", sans-serif;
        font-weight: 700;
        animation: pulseAlert 1.5s infinite;
      }
      @keyframes pulseAlert {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.2); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }

  const yesBtn = modal.querySelector('.modal-btn.yes');
  const noBtn  = modal.querySelector('.modal-btn.no');
  const fileNameEl = modal.querySelector('.file-name');
  let pendingHref = null;

  noBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.style.display = 'none';
    pendingHref = null;
  });

  yesBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    if(!pendingHref){ modal.style.display = 'none'; return; }
    whoosh && whoosh.play && whoosh.play().catch(()=>{});
    setTimeout(()=>{
      window.location.href = pendingHref;
      pendingHref = null;
      modal.style.display = 'none';
    }, 1000);
  });

  // 🧩 Updated attachInterceptors — includes file name & skips _blank links
  function attachInterceptors(scope){
    const links = (scope || document).querySelectorAll('a.game-link');
    links.forEach(a=>{
      if(a.dataset.hook === '1') return;
      a.dataset.hook = '1';
      a.addEventListener('click', function(ev){
        // ✅ Skip links meant to open in new tabs
        if (this.target === '_blank') return;

        if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        ev.preventDefault();

        // 🏷️ Get game title dynamically
        const title = this.querySelector('.game-title')?.textContent?.trim() || 'Unknown File';
        fileNameEl.textContent = title;

        pendingHref = this.href;
        modal.style.display = 'flex';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=> attachInterceptors(document));
  window.SyzoHalloween = { attachInterceptors };
})();
