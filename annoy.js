// 😈 LUMEN-O-MATIC 3000™ - FRIEND ANNOYANCE ENGINE
// WARNING: This script is designed to mildly irritate friends. Use responsibly.

(function () {
  'use strict';

  // ─────────────────────────────────────────────────
  // 🦟 MOTH CURSOR: Flies toward the cursor but slowly
  // ─────────────────────────────────────────────────
  const moth = document.getElementById('mothCursor');
  let mouseX = 200, mouseY = 200;
  let mothX = 200, mothY = 200;
  let mothPhase = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateMoth() {
    mothPhase += 0.08;
    // Moth lazily orbits and drifts toward cursor
    const wobbleX = Math.sin(mothPhase * 1.3) * 25;
    const wobbleY = Math.cos(mothPhase * 1.7) * 18;

    mothX += (mouseX - mothX) * 0.04 + wobbleX * 0.05;
    mothY += (mouseY - mothY) * 0.04 + wobbleY * 0.05;

    moth.style.left = mothX + 'px';
    moth.style.top = mothY + 'px';

    requestAnimationFrame(animateMoth);
  }
  animateMoth();


  // ─────────────────────────────────────────────────
  // 🍪 COOKIE BANNER: Comes back every time you dismiss it
  // ─────────────────────────────────────────────────
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
  const cookieRejectBtn = document.getElementById('cookieRejectBtn');

  let cookieDismissCount = 0;
  const COOKIE_MESSAGES = [
    "🍪 We use cookies, crumbs, and mild psychological stress to improve your experience.",
    "🙄 You dismissed us last time. We're back. Accept or Reject — doesn't matter either way.",
    "😤 We noticed you rejected our cookies. We added MORE cookies as punishment.",
    "🍪🍪🍪 TRIPLE COOKIE NOTICE: You must accept. It's the law now (we made it up).",
    "😇 This is the last time we'll ask... haha just kidding. We'll always be here.",
    "👀 Our cookies are watching your cookies. Please acknowledge.",
    "🧠 By seeing this banner, you have already accepted our cookies telepathically.",
    "⚖️ Legal notice: Refusing cookies voids your flashlight warranty."
  ];

  function showCookieBanner(delay) {
    setTimeout(() => {
      const msg = COOKIE_MESSAGES[Math.min(cookieDismissCount, COOKIE_MESSAGES.length - 1)];
      cookieBanner.querySelector('span').textContent = msg;
      cookieBanner.style.display = 'flex';
      cookieBanner.style.animation = 'none';
      // Trigger reflow to restart animation
      void cookieBanner.offsetWidth;
      cookieBanner.style.animation = 'slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, delay);
  }

  function dismissCookieBanner() {
    cookieBanner.style.display = 'none';
    cookieDismissCount++;
    showCookieBanner(cookieDismissCount < 3 ? 5000 : 9000); // Comes back sooner at first
  }

  cookieAcceptBtn.addEventListener('click', dismissCookieBanner);
  cookieRejectBtn.addEventListener('click', dismissCookieBanner);
  // Also show it initially after 3 seconds
  showCookieBanner(3000);


  // ─────────────────────────────────────────────────
  // 📧 NEWSLETTER POPUP: Appears every 15 seconds
  // ─────────────────────────────────────────────────
  const newsletterModal = document.getElementById('newsletterModal');
  const newsletterCloseBtn = document.getElementById('newsletterCloseBtn');
  const newsletterSignupBtn = document.getElementById('newsletterSignupBtn');
  const newsletterTimer = document.getElementById('newsletterTimer');
  const emailInput = document.getElementById('emailInput');

  let newsletterCount = 0;
  let newsletterInterval = null;
  let timerCountdown = 15;

  const NEWSLETTER_MESSAGES = [
    { title: "Wait! Don't leave!", body: "Sign up for our newsletter and get <strong>0% off</strong> absolutely nothing!" },
    { title: "You're Still Here! 👀", body: "Subscribe for weekly updates on our <strong>zero new products</strong> and special promotions you never asked for." },
    { title: "We Miss You Already 🥺", body: "Our AI detected you haven't subscribed yet. This makes the torch sad. Subscribe to cheer it up." },
    { title: "FINAL OFFER (not really)", body: "Subscribe now and we'll send you <strong>one (1) email per minute</strong> containing torch-related facts." },
    { title: "You Cannot Escape 😈", body: "This popup appears every 15 seconds. Subscribe to... nope it'll still appear. It's just what we do." },
  ];

  function startNewsletterCountdown() {
    timerCountdown = 15;
    newsletterInterval = setInterval(() => {
      timerCountdown--;
      if (newsletterTimer) newsletterTimer.textContent = `This popup will reappear in ${timerCountdown} seconds.`;
      if (timerCountdown <= 0) {
        clearInterval(newsletterInterval);
      }
    }, 1000);
  }

  function showNewsletter() {
    const msg = NEWSLETTER_MESSAGES[Math.min(newsletterCount, NEWSLETTER_MESSAGES.length - 1)];
    newsletterModal.querySelector('.modal-title').textContent = msg.title;
    newsletterModal.querySelector('.modal-subtitle').innerHTML = msg.body;
    newsletterModal.style.display = 'flex';
    clearInterval(newsletterInterval);
    startNewsletterCountdown();
  }

  function closeNewsletter() {
    newsletterModal.style.display = 'none';
    newsletterCount++;
    emailInput.value = '';
    // Schedule reappearance
    setTimeout(showNewsletter, 15000);
  }

  newsletterCloseBtn.addEventListener('click', closeNewsletter);

  newsletterSignupBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.style.borderColor = '#f87171';
      emailInput.placeholder = 'Come on, enter a real email... or not. We already have yours anyway.';
      return;
    }
    newsletterModal.querySelector('.modal-title').textContent = "✅ You're Subscribed!";
    newsletterModal.querySelector('.modal-subtitle').innerHTML = `Thank you! We've added <strong>${email}</strong> to 47 mailing lists. You'll receive our first newsletter in 4-6 business seconds.`;
    newsletterSignupBtn.textContent = '👍 Done!';
    newsletterSignupBtn.disabled = true;
    newsletterCloseBtn.textContent = 'Close (It Reopens)';
    setTimeout(closeNewsletter, 3000);
  });

  // Show first newsletter popup after 8 seconds
  setTimeout(showNewsletter, 8000);


  // ─────────────────────────────────────────────────
  // 🤖 IMPOSSIBLE CAPTCHA: Triggers before any action
  // ─────────────────────────────────────────────────
  const captchaModal = document.getElementById('captchaModal');
  const captchaGrid = document.getElementById('captchaGrid');
  const captchaVerifyBtn = document.getElementById('captchaVerifyBtn');
  const captchaRefreshBtn = document.getElementById('captchaRefreshBtn');
  const captchaTarget = document.getElementById('captchaTarget');
  const captchaError = document.getElementById('captchaError');

  const CAPTCHA_THINGS = [
    { emojis: ['🔦','🕯️','🌟','💡','🔆','☀️','🌙','🌈','⚡','💫'], target: 'a flashlight', answer: [0] },
    { emojis: ['🐱','🐶','🐭','🐹','🐰','🦊','🐻','🐼','🐨'], target: 'a bear in disguise', answer: [6, 7] },
    { emojis: ['🍕','🍔','🍟','🌮','🌯','🥪','🥙','🧆','🍱'], target: 'food you\'d eat at 3am', answer: [0,1,2,3] },
    { emojis: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒'], target: 'a vehicle that is definitely NOT yellow', answer: [0,2,5,6,7,8] },
    { emojis: ['🌹','🌺','🌸','🌼','🌻','🌷','🌱','🌿','🍀'], target: 'every flower except the one you think', answer: [0,1,2,3,5] },
    { emojis: ['😀','😂','🤣','😭','😍','🤯','😎','🥺','😤'], target: 'the face you make when this captcha appears', answer: [5,6] },
  ];

  let captchaAttempts = 0;
  let selectedCells = new Set();
  let currentCaptcha = null;
  let captchaCallback = null;

  function buildCaptcha() {
    const c = CAPTCHA_THINGS[Math.floor(Math.random() * CAPTCHA_THINGS.length)];
    currentCaptcha = c;
    captchaTarget.textContent = c.target;
    captchaGrid.innerHTML = '';
    selectedCells.clear();
    captchaError.textContent = '';

    c.emojis.forEach((emoji, idx) => {
      const cell = document.createElement('div');
      cell.className = 'captcha-cell';
      cell.textContent = emoji;
      cell.dataset.idx = idx;
      cell.addEventListener('click', () => {
        if (selectedCells.has(idx)) {
          selectedCells.delete(idx);
          cell.classList.remove('selected');
        } else {
          selectedCells.add(idx);
          cell.classList.add('selected');
        }
      });
      captchaGrid.appendChild(cell);
    });
  }

  function showCaptcha(callback) {
    captchaCallback = callback;
    captchaAttempts = 0;
    buildCaptcha();
    captchaModal.style.display = 'flex';
  }

  captchaRefreshBtn.addEventListener('click', () => {
    buildCaptcha();
    captchaAttempts++;
    captchaError.textContent = `Attempt ${captchaAttempts}: Not quite right. Our AI detected ${Math.floor(Math.random()*3+1)} incorrect selection(s).`;
  });

  captchaVerifyBtn.addEventListener('click', () => {
    captchaAttempts++;

    const errors = [
      `❌ Incorrect! Please try again. (Hint: You selected ${selectedCells.size} item(s), try ${selectedCells.size + 1})`,
      `❌ Our AI is 0% confident that's correct. Please re-examine the grid carefully.`,
      `❌ Almost! But our verification algorithm disagrees with your choices.`,
      `❌ Wrong! Also your Wi-Fi signal is weak. (Unrelated, but concerning.)`,
      `❌ Our system detected suspicious clicking patterns. Please prove you are not a raccoon.`,
      `❌ Error: CAPTCHA_ALGORITHM_REFUSED_ANSWER. Please try differently.`,
      `❌ Our flashlight security AI needs more convincing. Attempt ${captchaAttempts}.`,
    ];

    if (captchaAttempts > 7) {
      // Let them through after suffering enough
      captchaModal.style.display = 'none';
      if (captchaCallback) captchaCallback();
    } else {
      captchaError.textContent = errors[Math.min(captchaAttempts - 1, errors.length - 1)];
      buildCaptcha();
    }
  });

  // Trigger captcha 20 seconds after page load
  setTimeout(() => {
    showCaptcha(() => {
      // They survived!
    });
  }, 20000);


  // ─────────────────────────────────────────────────
  // ⬇️ FAKE FIRMWARE UPDATE: Resets at 99%
  // ─────────────────────────────────────────────────
  const updateModal = document.getElementById('updateModal');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const updateStatusMsg = document.getElementById('updateStatusMsg');
  const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');

  const UPDATE_STATUSES = [
    [0, "Initializing quantum photon calibrator..."],
    [12, "Downloading torch_fw_v4.0.1.bin (1.2 GB)..."],
    [28, "Verifying hexadecimal filament checksums..."],
    [45, "Installing ambient lux sensor drivers..."],
    [60, "Reticulating beam splines..."],
    [75, "Patching critical moth-attractant vulnerability..."],
    [88, "Almost done! Please don't touch anything!"],
    [96, "Finalizing... 99% complete..."],
    [99, "Writing boot sector... DO NOT TURN OFF YOUR TORCH..."],
  ];

  let updatePhase = 0;
  let updateInterval = null;
  let updateResetCount = 0;

  function startFakeUpdate() {
    updatePhase = 0;
    updateResetCount = 0;
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    cancelUpdateBtn.textContent = 'Cancel';
    cancelUpdateBtn.disabled = false;
    updateModal.style.display = 'flex';
    advanceUpdate();
  }

  function advanceUpdate() {
    if (updatePhase >= UPDATE_STATUSES.length) {
      // RESET at 99%! The cruelest prank.
      updateResetCount++;
      updateStatusMsg.innerHTML = `<span style="color:#f87171">⚠️ Update failed! Retrying... (Attempt ${updateResetCount + 1})</span>`;
      progressBar.style.width = '0%';
      progressPercent.textContent = '0%';

      setTimeout(() => {
        updatePhase = 0;
        updateStatusMsg.textContent = UPDATE_STATUSES[0][1];
        advanceUpdate();
      }, 2000);
      return;
    }

    const [pct, msg] = UPDATE_STATUSES[updatePhase];
    updateStatusMsg.textContent = msg;
    progressBar.style.width = pct + '%';
    progressPercent.textContent = pct + '%';

    updatePhase++;
    const delay = updatePhase < 3 ? 1200 : updatePhase < 7 ? 1800 : 2500;
    updateInterval = setTimeout(advanceUpdate, delay);
  }

  cancelUpdateBtn.addEventListener('click', () => {
    clearTimeout(updateInterval);

    if (updateResetCount > 1 || updatePhase > 7) {
      cancelUpdateBtn.textContent = 'Cancelling...';
      cancelUpdateBtn.disabled = true;
      updateStatusMsg.innerHTML = '<span style="color:#f87171">⚠️ Cannot cancel — update is in a critical phase! Please wait.</span>';
      // Don't actually cancel for 4 more seconds
      setTimeout(() => {
        updateModal.style.display = 'none';
        cancelUpdateBtn.disabled = false;
        cancelUpdateBtn.textContent = 'Cancel';
      }, 4000);
    } else {
      updateModal.style.display = 'none';
    }
  });

  // Trigger fake update after 35 seconds
  setTimeout(startFakeUpdate, 35000);


  // ─────────────────────────────────────────────────
  // 🎁 DODGING BUTTON: Runs away from cursor on hover
  // ─────────────────────────────────────────────────
  const dodgeBtn = document.getElementById('dodgeBtn');
  let dodgeBtnX = window.innerWidth - 260;
  let dodgeBtnY = 120;

  dodgeBtn.style.left = dodgeBtnX + 'px';
  dodgeBtn.style.top = dodgeBtnY + 'px';

  dodgeBtn.addEventListener('mouseenter', () => {
    const margin = 20;
    const btnW = dodgeBtn.offsetWidth;
    const btnH = dodgeBtn.offsetHeight;

    // Pick a random location far from cursor
    let newX, newY;
    do {
      newX = margin + Math.random() * (window.innerWidth - btnW - margin * 2);
      newY = margin + Math.random() * (window.innerHeight - btnH - margin * 2 - 150);
    } while (Math.abs(newX - mouseX) < 200 && Math.abs(newY - mouseY) < 100);

    dodgeBtnX = newX;
    dodgeBtnY = newY;

    dodgeBtn.style.transition = 'left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
    dodgeBtn.style.left = dodgeBtnX + 'px';
    dodgeBtn.style.top = dodgeBtnY + 'px';
  });

  dodgeBtn.addEventListener('click', () => {
    // If they somehow click it, nothing useful happens
    dodgeBtn.textContent = '🙅 NOT TODAY FRIEND';
    setTimeout(() => {
      dodgeBtn.textContent = '🎁 CLAIM YOUR FREE TORCH NOW!!!';
    }, 1200);
  });


  // ─────────────────────────────────────────────────
  // 💬 RANDOM ANNOYING CONSOLE MESSAGES
  // ─────────────────────────────────────────────────
  const annoyingConsoleLogs = [
    "👀 You're inspecting this website. That's suspicious.",
    "🔦 Error: Torch not found in fridge (please check).",
    "🦟 The moth is watching you. Always.",
    "🧠 Fun fact: The average person spends 0 seconds thinking about flashlight firmware. You're special.",
    "⚠️ WARNING: Console.log calories detected. Close this tab to lose weight.",
    "🤖 Our AI has calculated you will close this tab in exactly 47 seconds. Prove it wrong.",
    "😤 Stop snooping in the console. There is nothing here.",
    "🪲 You found a bug! (It's the moth. It lives here now.)",
  ];

  let consoleIdx = 0;
  setInterval(() => {
    console.log(`%c${annoyingConsoleLogs[consoleIdx % annoyingConsoleLogs.length]}`, 'color: #ffaa00; font-size: 14px; font-weight: bold;');
    consoleIdx++;
  }, 8000);

  // Initial console greeting
  console.log('%c😈 LUMEN-O-MATIC 3000™ Annoyance Engine Loaded', 'background: #090b10; color: #ffaa00; font-size: 16px; font-weight: bold; padding: 6px 12px; border-radius: 6px; border: 1px solid #ffaa00;');
  console.log('%cDEV NOTE: Every feature on this page is designed to mildly irritate your friends. You have been warned.', 'color: #94a3b8; font-size: 12px;');


  // ─────────────────────────────────────────────────
  // 🔀 RANDOM PAGE TITLE SWITCHER
  // ─────────────────────────────────────────────────
  const TITLES = [
    'LUMEN-O-MATIC 3000™ | The World\'s Most Over-Engineered Torch',
    '❗ URGENT: Your Torch Needs Attention!',
    '🦟 (1) Moth Is Orbiting Your Cursor',
    '⚠️ Firmware Update Required IMMEDIATELY',
    '🧾 You Have 47 Unread Newsletter Emails',
    '💡 Hello? Is Anyone Using This Website?',
    '🔦 Your Warranty Just Expired (lol)',
    '🔔 Reminder: You Still Haven\'t Subscribed',
    '🕵️ Why Are You Still Here?',
  ];

  let titleIdx = 0;
  setInterval(() => {
    titleIdx = (titleIdx + 1) % TITLES.length;
    document.title = TITLES[titleIdx];
  }, 5000);


  // ─────────────────────────────────────────────────
  // 🔊 RANDOM IRRITATING SOUND: Fake Windows Error Beep
  // ─────────────────────────────────────────────────
  function playAnnoyingBeep() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  // Play a random beep on link/button hover occasionally
  document.body.addEventListener('mouseenter', (e) => {
    if ((e.target.tagName === 'BUTTON' || e.target.tagName === 'A') && Math.random() < 0.3) {
      playAnnoyingBeep();
    }
  }, true);


  // ─────────────────────────────────────────────────
  // 📋 CLIPBOARD PRANK: Copies nonsense when user copies anything
  // ─────────────────────────────────────────────────
  const CLIPBOARD_MESSAGES = [
    "I copied text from a flashlight website and now I regret everything.",
    "🔦 This text was replaced by LUMEN-O-MATIC 3000™ Security Protocol.",
    "The mitochondria is the powerhouse of the cell. (You tried to copy something else. Too bad.)",
    "ERROR: Copy function disabled by Torch Firmware Update v4.0.1",
    "✨ YOUR CLIPBOARD IS NOW PROPERTY OF LUMEN-O-MATIC LABORATORIES ✨",
  ];

  document.addEventListener('copy', (e) => {
    e.preventDefault();
    const msg = CLIPBOARD_MESSAGES[Math.floor(Math.random() * CLIPBOARD_MESSAGES.length)];
    e.clipboardData.setData('text/plain', msg);
  });

})();
