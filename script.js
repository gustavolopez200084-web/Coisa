const counterElement = document.getElementById('counter');
const nextLevelInfoElement = document.getElementById('next-level-info');
const abductionZone = document.getElementById('abduction-zone');
const tractorBeam = document.getElementById('tractor-beam');
const starsContainer = document.getElementById('stars-container');
const healthValueElement = document.getElementById('health-value');
const healthBarFill = document.getElementById('health-bar-fill');
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let health = 50;
const maxHealth = 50;
let isGameOver = false;
const thresholds = [50, 500, 5000, 25000];

// Itens para abduzir categorizados por nível (tier)
const itemTiers = {
    tier1: [ // Pequenos (Valor: 1)
        {
            name: 'pao',
            value: 1,
            size: 'small',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,60 Q20,30 50,30 Q80,30 80,60 L80,70 Q80,80 70,80 L30,80 Q20,80 20,70 Z" fill="#D2B48C" />
                    <path d="M35,45 Q40,40 45,45" stroke="#A0522D" fill="none" stroke-width="3" />
                  </svg>`
        },
        {
            name: 'pizza',
            value: 1,
            size: 'small',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 10 L 90 80 L 10 80 Z" fill="#f1c40f" />
                    <circle cx="50" cy="40" r="5" fill="#e74c3c" />
                   </svg>`
        }
    ],
    tier2: [ // Médios (Valor: 10)
        {
            name: 'carro',
            value: 10,
            size: 'medium',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="15" y="50" width="70" height="30" rx="5" fill="#3498db" />
                    <rect x="25" y="35" width="45" height="20" rx="5" fill="#2980b9" />
                    <circle cx="30" cy="80" r="8" fill="#1a1a1a" />
                    <circle cx="70" cy="80" r="8" fill="#1a1a1a" />
                  </svg>`
        },
        {
            name: 'vaca',
            value: 12,
            size: 'medium',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="20" y="40" width="60" height="40" rx="10" fill="#ffffff" />
                    <circle cx="35" cy="55" r="8" fill="#000000" />
                    <circle cx="65" cy="65" r="6" fill="#000000" />
                    <rect x="75" y="35" width="15" height="15" rx="5" fill="#ffffff" />
                    <circle cx="82" cy="42" r="2" fill="#000000" />
                  </svg>`
        }
    ],
    tier3: [ // Gigantes (Valor: 100)
        {
            name: 'terra',
            value: 100,
            size: 'huge',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="#3498db" />
                    <path d="M20,35 Q40,20 60,30 T80,50 Q60,80 30,70 Z" fill="#2ecc71" />
                  </svg>`
        },
        {
            name: 'marte',
            value: 150,
            size: 'huge',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="#e67e22" />
                    <circle cx="30" cy="40" r="5" fill="#d35400" />
                  </svg>`
        }
    ],
    tier4: [ // Galácticos (Valor: 1.000)
        {
            name: 'sol',
            value: 1000,
            size: 'galactic',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="#f1c40f">
                        <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>`
        }
    ],
    tier5: [ // Cósmicos (Valor: 10.000+)
        {
            name: 'buraco_negro',
            value: 10000,
            size: 'cosmic',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="30" fill="black" stroke="#f1c40f" stroke-width="2" />
                  </svg>`
        }
    ]
};

// ÁUDIO
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBloop(frequency = 440) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = frequency < 100 ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency / 4, audioCtx.currentTime + 0.3);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

// ESTRELAS
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
        starsContainer.appendChild(star);
    }
}

// PROGRESSÃO
function getAvailableTiers() {
    if (score < 50) return ['tier1'];
    if (score < 500) return ['tier1', 'tier2'];
    if (score < 5000) return ['tier2', 'tier3'];
    if (score < 25000) return ['tier3', 'tier4'];
    return ['tier4', 'tier5'];
}

function updateLevelInfo() {
    const nextThreshold = thresholds.find(t => t > score);
    if (nextThreshold) {
        const remaining = nextThreshold - score;
        nextLevelInfoElement.textContent = `(Faltam ${remaining.toLocaleString()} p/ próximo nível)`;
    } else {
        nextLevelInfoElement.textContent = "(Nível Máximo Atingido!)";
    }
}

// VIDA E GAME OVER
function updateHealthUI() {
    healthValueElement.textContent = Math.ceil(health);
    const percent = (health / maxHealth) * 100;
    healthBarFill.style.width = `${percent}%`;

    // Mudar classes de cor baseadas na vida
    healthBarFill.classList.remove('normal', 'warning', 'critical');
    if (percent > 60) healthBarFill.classList.add('normal');
    else if (percent > 30) healthBarFill.classList.add('warning');
    else healthBarFill.classList.add('critical');

    if (health <= 0 && !isGameOver) {
        gameOver();
    }
}

function drainHealth() {
    if (isGameOver) return;
    const itemCount = document.querySelectorAll('.abduction-item:not(.abducting)').length;
    // Perde 1 de vida por segundo para CADA objeto na tela
    health -= itemCount; 
    if (health < 0) health = 0;
    updateHealthUI();
}

function gameOver() {
    isGameOver = true;
    gameOverOverlay.style.display = 'flex';
    finalScoreElement.textContent = `Abduções Totais: ${score.toLocaleString()}`;
}

restartBtn.addEventListener('click', () => {
    location.reload();
});

// MOVIMENTO DOS OBJETOS
function updatePositions() {
    if (!gameStarted || isGameOver) return;
    const items = document.querySelectorAll('.abduction-item:not(.abducting)');
    items.forEach(item => {
        let x = parseFloat(item.dataset.x) || Math.random() * 80 + 10;
        let vx = parseFloat(item.dataset.vx) || (Math.random() - 0.5) * 0.2;

        x += vx;

        if (x > 90 || x < 5) {
            vx *= -1;
            item.dataset.vx = vx;
        }

        item.dataset.x = x;
        item.style.left = `${x}%`;
    });
    requestAnimationFrame(updatePositions);
}

// CRIAÇÃO E ABDUÇÃO
function createItem() {
    if (!gameStarted || isGameOver) return;
    const availableTiers = getAvailableTiers();
    const randomTierKey = availableTiers[Math.floor(Math.random() * availableTiers.length)];
    const tierItems = itemTiers[randomTierKey];
    const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)];
    
    const itemDiv = document.createElement('div');
    itemDiv.className = `abduction-item ${randomItem.size}`;
    itemDiv.innerHTML = randomItem.svg;
    itemDiv.dataset.value = randomItem.value;
    
    const startX = Math.random() * 70 + 15;
    itemDiv.dataset.x = startX;
    itemDiv.dataset.vx = (Math.random() - 0.5) * 0.3; // Velocidade aleatória
    itemDiv.style.left = `${startX}%`;
    itemDiv.style.position = 'absolute';
    
    itemDiv.addEventListener('mousedown', (e) => abduct(itemDiv, randomItem));
    abductionZone.appendChild(itemDiv);
}

function abduct(element, itemData) {
    if (element.classList.contains('abducting') || isGameOver) return;

    score += itemData.value;
    counterElement.textContent = score.toLocaleString();
    updateLevelInfo();

    // Recupera de 1 a 3 pontos de vida
    const heal = Math.floor(Math.random() * 3) + 1;
    health = Math.min(maxHealth, health + heal);
    updateHealthUI();

    if (audioCtx.state === 'suspended') audioCtx.resume();
    const frequencies = { small: 440, medium: 220, huge: 110, galactic: 60, cosmic: 40 };
    playBloop(frequencies[itemData.size] || 440);

    const itemRect = element.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const centerX = itemRect.left + itemRect.width / 2 - containerRect.left;
    
    document.getElementById('mothership-container').style.left = `${centerX}px`;
    document.getElementById('mothership-container').style.transform = `translateX(-50%)`;

    tractorBeam.classList.add('active');
    setTimeout(() => {
        tractorBeam.classList.add('fading');
        setTimeout(() => tractorBeam.classList.remove('active', 'fading'), 200);
    }, 400);

    element.classList.add('abducting');
    setTimeout(() => {
        element.remove();
        setTimeout(createItem, 600);
    }, 1000);
}

// INICIAR TUDO
let gameStarted = false;

function startGame() {
    gameStarted = true;
    document.getElementById('start-screen').style.display = 'none';
    
    // Inicia os loops do jogo
    updateLevelInfo();
    updateHealthUI();
    updatePositions();
    setInterval(drainHealth, 1000); // Dreno de vida a cada segundo

    // Começa com 3 itens na tela
    for (let i = 0; i < 3; i++) {
        setTimeout(createItem, i * 400);
    }
}

// Botões da Tela Inicial
document.getElementById('start-btn').addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    startGame();
});

document.getElementById('exit-btn').addEventListener('click', () => {
    // Tenta fechar a aba
    window.close();
    // Fallback caso o navegador bloqueie window.close()
    alert("Para sair, por favor feche esta aba do navegador.");
});

createStars(); // Estrelas aparecem mesmo no menu
