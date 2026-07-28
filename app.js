// LUMEN-O-MATIC 3000™ - Master Engine & Audio Synthesizer

(function () {
  'use strict';

  // --- STATE ---
  const state = {
    isOn: true,
    currentMode: 'standard', // 'standard', 'batterySaver', 'policeSiren', 'disco', 'uvGhost', 'candle', 'solar'
    currentBulb: 'standard', // 'standard', 'tactical', 'rgb', 'ember'
    soundEnabled: true,
    mousePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    beamPos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    flickering: false,
    foundItems: new Set(),
    discoHue: 0,
    candleFlicker: 1,
    sirenState: 0, // 0 = Red, 1 = Blue
  };

  // Total hidden items count
  const TOTAL_ITEMS = 6;

  // --- DOM ELEMENTS ---
  const canvas = document.getElementById('lightCanvas');
  const ctx = canvas.getContext('2d');
  const powerBtn = document.getElementById('powerBtn');
  const powerIcon = document.getElementById('powerIcon');
  const powerText = document.getElementById('powerText');
  const slapBtn = document.getElementById('slapBtn');
  const resetRoomBtn = document.getElementById('resetRoomBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const foundCounter = document.getElementById('foundCounter');
  const warningToast = document.getElementById('warningToast');
  const toastMessage = document.getElementById('toastMessage');
  const controlDock = document.querySelector('.control-dock');
  const modePills = document.querySelectorAll('.mode-pill');
  const bulbCards = document.querySelectorAll('.bulb-card');
  const faqItems = document.querySelectorAll('.faq-item');
  const hiddenItems = document.querySelectorAll('.hidden-item');

  // --- WEB AUDIO API ENGINE ---
  let audioCtx = null;
  let sirenOscillator = null;
  let sirenGain = null;
  let discoInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play mechanical toggle switch sound
  function playSwitchClick() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.7, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  // Play kinetic slap sound (low thud + spring rattle)
  function playSlapSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    // Low thump
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(1.0, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }

  // Play happy discovery chime
  function playFoundChime() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = audioCtx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  // Police Siren audio toggle
  function startSirenSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx || sirenOscillator) return;

    sirenOscillator = audioCtx.createOscillator();
    sirenGain = audioCtx.createGain();

    sirenOscillator.type = 'sawtooth';
    sirenGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

    sirenOscillator.connect(sirenGain);
    sirenGain.connect(audioCtx.destination);

    sirenOscillator.start();
  }

  function stopSirenSound() {
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch (e) {}
      sirenOscillator = null;
      sirenGain = null;
    }
  }

  function updateSirenAudio() {
    if (state.currentMode === 'policeSiren' && state.isOn && state.soundEnabled) {
      startSirenSound();
      if (sirenOscillator && audioCtx) {
        const targetFreq = state.sirenState === 0 ? 800 : 440;
        sirenOscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
      }
    } else {
      stopSirenSound();
    }
  }

  // --- CANVAS RESIZE & BEAM RENDERER ---
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Mouse & Touch Movement Tracking
  function handlePointerMove(e) {
    if (e.touches && e.touches[0]) {
      state.mousePos.x = e.touches[0].clientX;
      state.mousePos.y = e.touches[0].clientY;
    } else {
      state.mousePos.x = e.clientX;
      state.mousePos.y = e.clientY;
    }
  }

  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('touchmove', handlePointerMove, { passive: true });

  // Main Canvas Render Loop
  function renderCanvas() {
    // Smooth lerp beam position
    state.beamPos.x += (state.mousePos.x - state.beamPos.x) * 0.18;
    state.beamPos.y += (state.mousePos.y - state.beamPos.y) * 0.18;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If Torch is OFF or Battery Saver Mode is ON
    if (!state.isOn || state.currentMode === 'batterySaver') {
      ctx.fillStyle = 'rgba(7, 9, 14, 0.98)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(renderCanvas);
      return;
    }

    // Solar Mode Catch
    if (state.currentMode === 'solar') {
      ctx.fillStyle = 'rgba(6, 8, 12, 0.96)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffaa00';
      ctx.font = '700 1.2rem "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️ SOLAR MODE: Sunlight not detected by your monitor!', canvas.width / 2, canvas.height / 2);
      ctx.font = '400 0.9rem "Space Grotesk", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Please point your display directly at the sun to activate beam.', canvas.width / 2, canvas.height / 2 + 30);
      requestAnimationFrame(renderCanvas);
      return;
    }

    // Draw dark shadow overlay
    ctx.fillStyle = 'rgba(7, 9, 14, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configure Beam Parameters based on Bulb & Mode
    let radius = 220;
    let beamColorInner = 'rgba(255, 235, 170, 0.95)';
    let beamColorOuter = 'rgba(255, 180, 50, 0)';

    // Handle Bulb Types
    if (state.currentBulb === 'tactical') {
      radius = 160;
      beamColorInner = 'rgba(200, 250, 255, 0.98)';
      beamColorOuter = 'rgba(0, 240, 255, 0)';
    } else if (state.currentBulb === 'rgb') {
      radius = 230;
      state.discoHue = (state.discoHue + 2) % 360;
      beamColorInner = `hsla(${state.discoHue}, 100%, 75%, 0.95)`;
      beamColorOuter = `hsla(${state.discoHue}, 100%, 50%, 0)`;
    } else if (state.currentBulb === 'ember') {
      radius = 200;
      beamColorInner = 'rgba(255, 150, 60, 0.9)';
      beamColorOuter = 'rgba(255, 80, 0, 0)';
    }

    // Handle Special Torch Modes
    if (state.currentMode === 'policeSiren') {
      radius = 280;
      if (Math.floor(Date.now() / 150) % 2 === 0) {
        state.sirenState = 0; // Red
        beamColorInner = 'rgba(255, 0, 70, 0.95)';
        beamColorOuter = 'rgba(255, 0, 0, 0)';
      } else {
        state.sirenState = 1; // Blue
        beamColorInner = 'rgba(0, 120, 255, 0.95)';
        beamColorOuter = 'rgba(0, 80, 255, 0)';
      }
      updateSirenAudio();
    } else if (state.currentMode === 'disco') {
      radius = 260;
      state.discoHue = (state.discoHue + 4) % 360;
      beamColorInner = `hsla(${state.discoHue}, 100%, 70%, 0.95)`;
      beamColorOuter = `hsla(${state.discoHue}, 100%, 40%, 0)`;
    } else if (state.currentMode === 'uvGhost') {
      radius = 240;
      beamColorInner = 'rgba(168, 85, 247, 0.95)';
      beamColorOuter = 'rgba(126, 34, 206, 0)';
    } else if (state.currentMode === 'candle') {
      state.candleFlicker = 0.85 + Math.random() * 0.3;
      radius = 180 * state.candleFlicker;
      beamColorInner = 'rgba(255, 170, 50, 0.9)';
      beamColorOuter = 'rgba(255, 100, 0, 0)';
    }

    // Handle 1998 Bulb Flickering state
    if (state.flickering) {
      if (Math.random() < 0.4) {
        radius *= 0.3;
        beamColorInner = 'rgba(255, 180, 50, 0.2)';
      }
    }

    // Cut out spotlight hole using Composite Operation
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    const grad = ctx.createRadialGradient(
      state.beamPos.x,
      state.beamPos.y,
      0,
      state.beamPos.x,
      state.beamPos.y,
      radius
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.8)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(state.beamPos.x, state.beamPos.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw glowing spotlight cone overlay on top
    const overlayGrad = ctx.createRadialGradient(
      state.beamPos.x,
      state.beamPos.y,
      0,
      state.beamPos.x,
      state.beamPos.y,
      radius
    );
    overlayGrad.addColorStop(0, beamColorInner);
    overlayGrad.addColorStop(0.8, beamColorOuter);

    ctx.fillStyle = overlayGrad;
    ctx.beginPath();
    ctx.arc(state.beamPos.x, state.beamPos.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Check hidden items collision with beam center
    checkItemDiscovery(state.beamPos.x, state.beamPos.y, radius);

    requestAnimationFrame(renderCanvas);
  }

  // --- SCAVENGER HUNT DISCOVERY LOGIC ---
  function checkItemDiscovery(bx, by, radius) {
    if (!state.isOn || state.currentMode === 'batterySaver' || state.currentMode === 'solar') return;

    hiddenItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;

      const dist = Math.hypot(bx - itemCenterX, by - itemCenterY);

      // If beam covers the item
      if (dist < radius * 0.75) {
        item.classList.add('illuminated');

        // UV mode requirement check for item6 (Alien Footprint)
        if (item.classList.contains('uv-only') && state.currentMode !== 'uvGhost') {
          return;
        }

        if (!state.foundItems.has(item.id)) {
          state.foundItems.add(item.id);
          item.classList.add('found');

          // Trigger toast announcement
          const itemName = item.getAttribute('data-name');
          const itemDesc = item.getAttribute('data-desc');
          showToast(`🎉 Discovered: <strong>${itemName}</strong>! (${itemDesc})`);

          playFoundChime();
          updateFoundHUD();
        }
      } else {
        item.classList.remove('illuminated');
      }
    });
  }

  function updateFoundHUD() {
    foundCounter.textContent = `${state.foundItems.size}/${TOTAL_ITEMS}`;

    if (state.foundItems.size === TOTAL_ITEMS) {
      setTimeout(() => {
        showToast('🏆 CONGRATULATIONS! You discovered all 6 night curiosities! You are a Certified Dark-Room Master!');
      }, 500);
    }
  }

  // --- TOAST NOTIFICATIONS ---
  let toastTimeout = null;
  function showToast(msg) {
    toastMessage.innerHTML = msg;
    warningToast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      warningToast.classList.remove('show');
    }, 4500);
  }

  // --- INTERACTIVE EVENT LISTENERS ---

  // Power Button
  powerBtn.addEventListener('click', () => {
    state.isOn = !state.isOn;
    playSwitchClick();

    if (state.isOn) {
      powerBtn.classList.add('on');
      powerIcon.textContent = '⚡';
      powerText.textContent = 'TORCH: ON';
    } else {
      powerBtn.classList.remove('on');
      powerIcon.textContent = '🔌';
      powerText.textContent = 'TORCH: OFF';
      stopSirenSound();
    }
  });

  // Slap Torch Button
  slapBtn.addEventListener('click', () => {
    playSlapSound();

    // Trigger UI Shake Animation
    controlDock.classList.add('shake-animation');
    setTimeout(() => {
      controlDock.classList.remove('shake-animation');
    }, 400);

    if (state.flickering) {
      state.flickering = false;
      showToast('🖐️ <strong>SLAP SUCCESSFUL!</strong> Loose copper contact spring realigned! 100% Lumens restored.');
    } else {
      showToast('🖐️ Slapped torch! Nothing was loose, but it felt satisfying.');
    }
  });

  // Reset Room Button
  resetRoomBtn.addEventListener('click', () => {
    playSwitchClick();
    state.foundItems.clear();
    hiddenItems.forEach((item) => item.classList.remove('found', 'illuminated'));
    updateFoundHUD();
    showToast('🔄 Dark room reset! Items hidden back into the shadows.');
  });

  // Sound Toggle Button
  audioToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      audioIcon.textContent = '🔊';
      audioToggleBtn.style.opacity = '1';
      showToast('🔊 Audio sound effects enabled.');
      initAudio();
    } else {
      audioIcon.textContent = '🔇';
      audioToggleBtn.style.opacity = '0.6';
      stopSirenSound();
      showToast('🔇 Muted all torch sound effects.');
    }
  });

  // Torch Mode Pills Switcher
  modePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      playSwitchClick();

      modePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const mode = pill.getAttribute('data-mode');
      state.currentMode = mode;

      document.body.classList.remove('mode-uv');
      stopSirenSound();

      if (mode === 'uvGhost') {
        document.body.classList.add('mode-uv');
        showToast('🔮 <strong>UV GHOST HUNTER MODE:</strong> Blacklight frequency engaged. Secret ectoplasmic signs revealed!');
      } else if (mode === 'batterySaver') {
        showToast('🪫 <strong>100% BATTERY SAVER:</strong> Emitting 0 photons. Saving 100% battery!');
      } else if (mode === 'policeSiren') {
        showToast('🚨 <strong>POLICE SIREN STROBE:</strong> WOOP WOOP! Flashing red/blue emergency lights!');
      } else if (mode === 'disco') {
        showToast('🪩 <strong>DISCO RAVE TORCH:</strong> RGB spectrum party beam activated!');
      } else if (mode === 'candle') {
        showToast('🕯️ <strong>GENTLE CANDLE:</strong> Soft flickering flame glow.');
      } else if (mode === 'solar') {
        showToast('☀️ <strong>SOLAR TORCH:</strong> Requires direct sunlight to emit light!');
      }
    });
  });

  // Bulb Configurator Selector
  bulbCards.forEach((card) => {
    card.addEventListener('click', () => {
      playSwitchClick();

      bulbCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');

      state.currentBulb = card.getAttribute('data-bulb');

      if (state.currentBulb === 'standard') {
        showToast('💡 Selected 1998 Incandescent Bulb. Caution: May flicker under vibration!');
      } else if (state.currentBulb === 'tactical') {
        showToast('⚡ Selected 100,000 Lumen Tactical Laser. Blinding cyan intensity!');
      } else if (state.currentBulb === 'rgb') {
        showToast('🌈 Selected RGB Gamer Laser. Frame rate boosted by +50 FPS!');
      } else if (state.currentBulb === 'ember') {
        showToast('🕯️ Selected Vintage Ember. Soft warm amber hue.');
      }
    });
  });

  // FAQ Accordion Handlers
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      playSwitchClick();
      const isOpen = item.classList.contains('open');

      faqItems.forEach((i) => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // Random 1998 Incandescent Flickering Generator
  setInterval(() => {
    if (state.isOn && state.currentBulb === 'standard' && !state.flickering) {
      if (Math.random() < 0.22) { // 22% chance
        state.flickering = true;
        showToast('⚡ <strong>WARNING:</strong> Incandescent bulb springs flickered loose! Click <strong>SLAP TORCH</strong>!');
      }
    }
  }, 5000);

  // Initialize loop
  requestAnimationFrame(renderCanvas);
})();
