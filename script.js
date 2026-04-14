const counterElement = document.getElementById('counter');
const abductionZone = document.getElementById('abduction-zone');
const tractorBeam = document.getElementById('tractor-beam');
const starsContainer = document.getElementById('stars-container');

let score = 0;

// Itens para abduzir (SVG strings)
const items = {
    vaca: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="40" width="60" height="40" rx="10" fill="#ffffff" />
            <circle cx="35" cy="55" r="8" fill="#000000" />
            <circle cx="65" cy="65" r="6" fill="#000000" />
            <rect x="75" y="35" width="15" height="15" rx="5" fill="#ffffff" />
            <circle cx="82" cy="42" r="2" fill="#000000" />
            <rect x="25" y="80" width="10" height="10" fill="#ffffff" />
            <rect x="65" y="80" width="10" height="10" fill="#ffffff" />
          </svg>`,
    pizza: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 L 90 80 L 10 80 Z" fill="#f1c40f" />
            <circle cx="50" cy="40" r="5" fill="#e74c3c" />
            <circle cx="40" cy="60" r="5" fill="#e74c3c" />
            <circle cx="60" cy="60" r="5" fill="#e74c3c" />
            <path d="M 10 80 Q 50 90 90 80" stroke="#d35400" stroke-width="8" fill="none" />
           </svg>`,
    arvore: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="45" y="60" width="10" height="20" fill="#5d4037" />
            <circle cx="50" cy="45" r="25" fill="#2e7d32" />
            <circle cx="35" cy="35" r="15" fill="#2e7d32" />
            <circle cx="65" cy="35" r="15" fill="#2e7d32" />
           </svg>`,
    policia: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="50" width="70" height="30" rx="5" fill="#2c3e50" />
            <rect x="25" y="35" width="45" height="20" rx="5" fill="#34495e" />
            <circle cx="30" cy="80" r="8" fill="#1a1a1a" />
            <circle cx="70" cy="80" r="8" fill="#1a1a1a" />
            <rect x="45" y="30" width="15" height="5" fill="#e74c3c" />
            <rect x="60" y="30" width="15" height="5" fill="#3498db" />
           </svg>`
};

// Gerador de Som "Bloop" usando Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBloop() {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

// Criação de estrelas decorativas
function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 4 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        // Formas geométricas simples
        if (Math.random() > 0.5) {
            star.style.borderRadius = '0';
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        starsContainer.appendChild(star);
    }
}

// Criar item aleatório na zona de abdução
function createItem() {
    const itemKeys = Object.keys(items);
    const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'abduction-item';
    itemDiv.innerHTML = items[randomKey];
    
    // Posição horizontal aleatória
    itemDiv.style.left = `${Math.random() * 80 + 10}%`;
    itemDiv.style.position = 'absolute';
    
    itemDiv.addEventListener('mousedown', (e) => abduct(itemDiv, e));
    
    abductionZone.appendChild(itemDiv);
}

function abduct(element, event) {
    if (element.classList.contains('abducting')) return;

    // Incrementar Placar
    score++;
    counterElement.textContent = score;

    // Som
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    playBloop();

    // Efeito Visual: Raio Trator
    const itemRect = element.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const centerX = itemRect.left + itemRect.width / 2 - containerRect.left;
    
    // Alinha o container da nave e raio horizontalmente com o item
    document.getElementById('mothership-container').style.left = `${centerX}px`;
    document.getElementById('mothership-container').style.transform = `translateX(-50%)`;

    tractorBeam.classList.add('active');
    setTimeout(() => {
        tractorBeam.classList.remove('active');
    }, 300);

    // Animação do item
    element.classList.add('abducting');

    // Remover e criar novo
    setTimeout(() => {
        element.remove();
        setTimeout(createItem, 1000);
    }, 1000);
}

// Iniciar Jogo
createStars();
// Começa com 3 itens na tela
for (let i = 0; i < 3; i++) {
    setTimeout(createItem, i * 300);
}
