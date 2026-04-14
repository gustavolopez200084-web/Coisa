const counterElement = document.getElementById('counter');
const abductionZone = document.getElementById('abduction-zone');
const tractorBeam = document.getElementById('tractor-beam');
const starsContainer = document.getElementById('stars-container');

let score = 0;

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
                    <path d="M50,45 Q55,40 60,45" stroke="#A0522D" fill="none" stroke-width="3" />
                  </svg>`
        },
        {
            name: 'pizza',
            value: 1,
            size: 'small',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 10 L 90 80 L 10 80 Z" fill="#f1c40f" />
                    <circle cx="50" cy="40" r="5" fill="#e74c3c" />
                    <circle cx="40" cy="60" r="5" fill="#e74c3c" />
                    <circle cx="60" cy="60" r="5" fill="#e74c3c" />
                   </svg>`
        },
        {
            name: 'maca',
            value: 1,
            size: 'small',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="55" r="30" fill="#cc0000" />
                    <path d="M50,25 Q55,10 70,15" stroke="#4a2c2a" stroke-width="4" fill="none" />
                    <path d="M50,25 Q45,20 40,25" fill="#2e7d32" />
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
            name: 'policia',
            value: 10,
            size: 'medium',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="15" y="50" width="70" height="30" rx="5" fill="#2c3e50" />
                    <rect x="25" y="35" width="45" height="20" rx="5" fill="#34495e" />
                    <circle cx="30" cy="80" r="8" fill="#1a1a1a" />
                    <circle cx="70" cy="80" r="8" fill="#1a1a1a" />
                    <rect x="45" y="30" width="15" height="5" fill="#e74c3c" />
                    <rect x="60" y="30" width="15" height="5" fill="#3498db" />
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
                    <rect x="25" y="80" width="10" height="10" fill="#ffffff" />
                    <rect x="65" y="80" width="10" height="10" fill="#ffffff" />
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
                    <circle cx="50" cy="50" r="45" fill="rgba(241, 196, 15, 0.3)">
                        <animate attributeName="r" values="42;48;42" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>`
        },
        {
            name: 'galaxia',
            value: 2500,
            size: 'galactic',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 50 M 10 50 Q 10 10 50 10 T 90 50 T 50 90 T 10 50" fill="none" stroke="#9b59b6" stroke-width="2" />
                    <path d="M50 50 M 20 50 Q 20 20 50 20 T 80 50 T 50 80 T 20 50" fill="none" stroke="#8e44ad" stroke-width="4" />
                    <circle cx="50" cy="50" r="10" fill="white">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
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
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10">
                         <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="5s" repeatCount="indefinite" />
                    </circle>
                  </svg>`
        },
        {
            name: 'universo',
            value: 50000,
            size: 'cosmic',
            svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#000" rx="10" />
                    <circle cx="30" cy="30" r="2" fill="white" />
                    <circle cx="70" cy="20" r="1" fill="white" />
                    <circle cx="50" cy="70" r="3" fill="white" />
                    <circle cx="10" cy="80" r="2" fill="white" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0, 242, 255, 0.2)" stroke-width="1" />
                  </svg>`
        }
    ]
};

// Gerador de Som "Bloop" usando Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBloop(frequency = 440) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = frequency < 100 ? 'square' : 'sine'; // Som mais agressivo para itens cósmicos
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency / 4, audioCtx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
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
        
        if (Math.random() > 0.5) {
            star.style.borderRadius = '0';
            star.style.transform = `rotate(${Math.random() * 360}deg)`;
        }
        
        starsContainer.appendChild(star);
    }
}

// Determinar qual tier usar baseado no score
function getAvailableTiers() {
    if (score < 50) return ['tier1'];
    if (score < 500) return ['tier1', 'tier2'];
    if (score < 5000) return ['tier2', 'tier3'];
    if (score < 25000) return ['tier3', 'tier4'];
    return ['tier4', 'tier5'];
}

// Criar item aleatório na zona de abdução
function createItem() {
    const availableTiers = getAvailableTiers();
    const randomTierKey = availableTiers[Math.floor(Math.random() * availableTiers.length)];
    const tierItems = itemTiers[randomTierKey];
    const randomItem = tierItems[Math.floor(Math.random() * tierItems.length)];
    
    const itemDiv = document.createElement('div');
    itemDiv.className = `abduction-item ${randomItem.size}`;
    itemDiv.innerHTML = randomItem.svg;
    itemDiv.dataset.value = randomItem.value;
    
    // Posição horizontal aleatória
    itemDiv.style.left = `${Math.random() * 70 + 15}%`; // Margem maior para itens grandes
    itemDiv.style.position = 'absolute';
    
    itemDiv.addEventListener('mousedown', (e) => abduct(itemDiv, randomItem));
    
    abductionZone.appendChild(itemDiv);
}

function abduct(element, itemData) {
    if (element.classList.contains('abducting')) return;

    // Incrementar Placar baseado no valor do item
    score += itemData.value;
    counterElement.textContent = score.toLocaleString(); // Formatação bonita para números grandes

    // Som baseado no tamanho (Escala Logarítmica de Gravidade)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const frequencies = {
        small: 440,
        medium: 220,
        huge: 110,
        galactic: 60,
        cosmic: 40
    };
    const freq = frequencies[itemData.size] || 440;
    playBloop(freq);

    // Efeito Visual: Raio Trator
    const itemRect = element.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const centerX = itemRect.left + itemRect.width / 2 - containerRect.left;
    
    document.getElementById('mothership-container').style.left = `${centerX}px`;
    document.getElementById('mothership-container').style.transform = `translateX(-50%)`;

    tractorBeam.classList.add('active');
    setTimeout(() => {
        tractorBeam.classList.add('fading');
        setTimeout(() => {
            tractorBeam.classList.remove('active', 'fading');
        }, 200);
    }, 400);

    // Animação do item
    element.classList.add('abducting');

    // Remover e criar novo
    setTimeout(() => {
        element.remove();
        setTimeout(createItem, 600); // Mais rápido conforme o caos aumenta
    }, 1000);
}

// Iniciar Jogo
createStars();
// Começa com 3 itens na tela
for (let i = 0; i < 3; i++) {
    setTimeout(createItem, i * 400);
}
