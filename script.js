    const HEART_PATH = 'M50,90 C45,82 0,58 0,32 C0,8 16,-2 34,5 C44,9 50,20 50,20 C50,20 56,9 66,5 C84,-2 100,8 100,32 C100,58 55,82 50,90Z';

    const colors = [
      '#e8697d', '#d4556a', '#c9707d', '#e07888',
      '#cf6275', '#b5596a', '#d98a95', '#c27483',
      '#e4818f', '#d16b7a', '#c4848e', '#d99aa3',
      '#cc6677', '#e09099', '#c07080'
    ];

    // Parse CSV: handle quoted fields, skip header row
    function parseCSV(text) {
      const lines = text.split('\n');
      const messages = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        // Remove surrounding quotes if present
        const msg = line.startsWith('"') && line.endsWith('"')
          ? line.slice(1, -1).replace(/""/g, '"')
          : line;
        messages.push(msg);
      }
      return messages;
    }

    // À Propos toggle
    const aboutPill = document.getElementById('aboutPill');
    const aboutLabel = aboutPill.querySelector('.about-label');
    aboutPill.addEventListener('click', (e) => {
      e.stopPropagation();
      aboutPill.classList.toggle('visible');
      aboutLabel.classList.toggle('hidden');
    });

    const grid = document.getElementById('grid');
    const randomBtn = document.getElementById('randomBtn');
    const zoomSlide = document.getElementById('zoomSlide');
    const zoomChevron = document.getElementById('zoomChevron');
    const cards = [];

    const mobileQuery = window.matchMedia('(max-width: 500px)');
    let currentOpen = null;
    let zoomMode = mobileQuery.matches;

    function heartSVG(color) {
      return `<svg viewBox="0 0 100 95" class="heart-svg"><path d="${HEART_PATH}" fill="${color}"/></svg>`;
    }

    // Adaptive font size based on text length
    function getFontSize(len) {
      if (len <= 50) return 13;
      if (len <= 80) return 12;
      if (len <= 110) return 10.5;
      if (len <= 150) return 9;
      return 8;
    }

    // Load messages from CSV and build the grid
    fetch('messages.csv')
      .then(response => response.text())
      .then(text => {
        const messages = parseCSV(text);

    // Mélange aléatoire des messages à chaque chargement
    for (let i = messages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [messages[i], messages[j]] = [messages[j], messages[i]];
    }

    messages.forEach((msg, i) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation = (Math.random() * 24 - 12).toFixed(1);
      const sizeVariation = (0.88 + Math.random() * 0.24).toFixed(2);

      const card = document.createElement('div');
      card.className = 'heart-card';
      card.style.setProperty('--color', color);
      card.style.transform = `rotate(${rotation}deg) scale(${sizeVariation})`;

      const fontSize = getFontSize(msg.length);
      const longClass = msg.length > 120 ? ' long-text' : '';

      card.innerHTML = `
    <div class="heart-inner">
      <div class="heart-front">
        ${heartSVG(color)}
      </div>
      <div class="heart-back">
        <div class="heart-back-wrap">
          ${heartSVG(color)}
          <div class="heart-back-text${longClass}" style="--fs:${fontSize}">${msg}</div>
        </div>
      </div>
    </div>
  `;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCard(card);
      });

      grid.appendChild(card);
      cards.push(card);
    });

    }); // end fetch

    function toggleCard(card) {
      const cls = zoomMode ? 'zoomed' : 'flipped';
      const otherCls = zoomMode ? 'flipped' : 'zoomed';

      if (currentOpen && currentOpen !== card) {
        const prev = currentOpen;
        setTimeout(() => {
          prev.classList.remove('flipped');
          prev.classList.remove('zoomed');
        }, 300);
      }

      // Remove the other mode's class if present
      card.classList.remove(otherCls);
      card.classList.toggle(cls);
      currentOpen = card.classList.contains(cls) ? card : null;
    }

    function closeCurrentCard() {
      if (currentOpen) {
        currentOpen.classList.remove('flipped');
        currentOpen.classList.remove('zoomed');
        currentOpen = null;
      }
    }

    document.addEventListener('click', () => {
      closeCurrentCard();
    });

    // Zoom slide button
    // Keep zoomMode in sync when resizing across the mobile breakpoint
    mobileQuery.addEventListener('change', (e) => {
      zoomMode = e.matches;
      zoomSlide.classList.toggle('active', zoomMode);
      closeCurrentCard();
    });

    zoomSlide.addEventListener('click', (e) => {
      e.stopPropagation();

      if (mobileQuery.matches) {
        // Mobile: direct toggle, no slide step
        zoomMode = !zoomMode;
        zoomSlide.classList.toggle('active', zoomMode);
        closeCurrentCard();
        return;
      }

      const isOpen = zoomSlide.classList.contains('open');

      if (!isOpen) {
        // Slide out
        zoomSlide.classList.add('open');
        zoomChevron.innerHTML = '&lsaquo;';
      } else {
        // Toggle zoom mode
        zoomMode = !zoomMode;
        zoomSlide.classList.toggle('active', zoomMode);
        zoomSlide.classList.remove('open');
        zoomChevron.innerHTML = '&rsaquo;';
        closeCurrentCard();
      }
    });

    // Click chevron to collapse when open
    zoomChevron.addEventListener('click', (e) => {
      if (zoomSlide.classList.contains('open')) {
        e.stopPropagation();
        zoomSlide.classList.remove('open');
        zoomChevron.innerHTML = '&rsaquo;';
      }
    });

    randomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCurrentCard();
      const card = cards[Math.floor(Math.random() * cards.length)];

      card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      card.classList.add('pulse');
      setTimeout(() => {
        card.classList.remove('pulse');
        toggleCard(card);
      }, 850);
    });
