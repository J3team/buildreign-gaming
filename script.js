// Statistics
let stats = {
    totalGames: 0,
    highScore: 0,
    totalTime: 0
};

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('quickbreak_stats');
    if (saved) {
        stats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

function saveStats() {
    localStorage.setItem('quickbreak_stats', JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('totalGames').textContent = stats.totalGames;
    document.getElementById('highScore').textContent = stats.highScore;
    document.getElementById('totalTime').textContent = Math.floor(stats.totalTime / 60) + 'm';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    setupActivityCards();
    console.log('🎮 QuickBreak loaded! Have fun!');
});

// Activity Cards Setup
function setupActivityCards() {
    const cards = document.querySelectorAll('.activity-card');
    cards.forEach(card => {
        card.querySelector('.btn-activity').addEventListener('click', function() {
            const activity = card.getAttribute('data-activity');
            openActivity(activity);
        });
    });
}

function openActivity(activity) {
    const modalId = activity + 'Modal';
    openModal(modalId);
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ===== DOODLE PAD =====
let canvas, ctx, isDrawing = false;

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('doodleCanvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        setupCanvas();
    }
});

function setupCanvas() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch support
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = document.getElementById('colorPicker').value;
    const size = document.getElementById('brushSize').value;

    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveDrawing() {
    const link = document.createElement('a');
    link.download = 'my-doodle.png';
    link.href = canvas.toDataURL();
    link.click();
}

// ===== TYPING SPEED TEST =====
const typingTexts = [
    "The quick brown fox jumps over the lazy dog near the riverbank.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do and never stop learning.",
    "In the middle of difficulty lies opportunity waiting to be discovered."
];

let typingState = {
    text: '',
    startTime: 0,
    timer: 30,
    interval: null,
    timerInterval: null
};

function startTypingGame() {
    typingState.text = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    typingState.startTime = Date.now();
    typingState.timer = 30;

    document.getElementById('typingText').textContent = typingState.text;
    document.getElementById('typingInput').value = '';
    document.getElementById('typingInput').disabled = false;
    document.getElementById('typingInput').focus();
    document.getElementById('typingStartBtn').textContent = 'Restart';

    const input = document.getElementById('typingInput');
    input.addEventListener('input', updateTypingStats);

    // Start timer
    typingState.timerInterval = setInterval(() => {
        typingState.timer--;
        document.getElementById('timer').textContent = typingState.timer;

        if (typingState.timer <= 0) {
            endTypingGame();
        }
    }, 1000);

    stats.totalGames++;
    saveStats();
}

function updateTypingStats() {
    const input = document.getElementById('typingInput').value;
    const text = typingState.text;

    // Calculate WPM
    const timeElapsed = (Date.now() - typingState.startTime) / 1000 / 60;
    const wordsTyped = input.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < Math.min(input.length, text.length); i++) {
        if (input[i] === text[i]) correct++;
    }
    const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy;

    // Update high score
    if (wpm > stats.highScore) {
        stats.highScore = wpm;
        saveStats();
        showConfetti();
    }

    // Check if completed
    if (input === text) {
        endTypingGame(true);
    }
}

function endTypingGame(completed = false) {
    clearInterval(typingState.timerInterval);
    document.getElementById('typingInput').disabled = true;

    if (completed) {
        showConfetti();
        alert('🎉 Congratulations! You completed the text!');
    } else {
        alert('⏰ Time\'s up! Try again to beat your score!');
    }
}

// ===== RANDOM PICKER =====
function pickRandom() {
    const input = document.getElementById('pickerInput').value;
    const names = input.split('\n').filter(n => n.trim().length > 0);

    if (names.length === 0) {
        alert('Please enter some names first!');
        return;
    }

    const resultDiv = document.querySelector('.picked-name');
    let spinCount = 0;
    const maxSpins = 20;

    const spinInterval = setInterval(() => {
        const randomName = names[Math.floor(Math.random() * names.length)];
        resultDiv.textContent = randomName;
        spinCount++;

        if (spinCount >= maxSpins) {
            clearInterval(spinInterval);
            const finalName = names[Math.floor(Math.random() * names.length)];
            resultDiv.textContent = finalName;
            showConfetti();
        }
    }, 100);

    stats.totalGames++;
    saveStats();
}

// ===== MATH RUSH =====
let mathState = {
    score: 0,
    timeLeft: 60,
    currentAnswer: 0,
    interval: null
};

function startMathGame() {
    mathState.score = 0;
    mathState.timeLeft = 60;

    document.getElementById('mathScore').textContent = 0;
    document.getElementById('mathTimer').textContent = 60;
    document.getElementById('mathAnswer').value = '';
    document.getElementById('mathAnswer').disabled = false;
    document.getElementById('mathAnswer').focus();
    document.getElementById('mathStartBtn').style.display = 'none';

    generateMathQuestion();

    // Setup answer input
    const input = document.getElementById('mathAnswer');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkMathAnswer();
        }
    });

    // Start timer
    mathState.interval = setInterval(() => {
        mathState.timeLeft--;
        document.getElementById('mathTimer').textContent = mathState.timeLeft;

        if (mathState.timeLeft <= 0) {
            endMathGame();
        }
    }, 1000);

    stats.totalGames++;
    saveStats();
}

function generateMathQuestion() {
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;

    let answer;
    let question;

    if (op === '+') {
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    } else if (op === '-') {
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
    } else {
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
    }

    mathState.currentAnswer = answer;
    document.getElementById('mathQuestion').textContent = question + ' = ?';
}

function checkMathAnswer() {
    const userAnswer = parseInt(document.getElementById('mathAnswer').value);

    if (userAnswer === mathState.currentAnswer) {
        mathState.score++;
        document.getElementById('mathScore').textContent = mathState.score;
        document.getElementById('mathAnswer').value = '';
        generateMathQuestion();

        // Visual feedback
        const questionDiv = document.getElementById('mathQuestion');
        questionDiv.style.color = '#4facfe';
        setTimeout(() => {
            questionDiv.style.color = '#667eea';
        }, 200);

        if (mathState.score > stats.highScore) {
            stats.highScore = mathState.score;
            saveStats();
        }
    } else {
        document.getElementById('mathAnswer').value = '';
        const questionDiv = document.getElementById('mathQuestion');
        questionDiv.style.color = '#fa709a';
        setTimeout(() => {
            questionDiv.style.color = '#667eea';
        }, 200);
    }
}

function endMathGame() {
    clearInterval(mathState.interval);
    document.getElementById('mathAnswer').disabled = true;
    document.getElementById('mathStartBtn').style.display = 'block';
    document.getElementById('mathQuestion').textContent = `Game Over! Score: ${mathState.score}`;

    if (mathState.score >= 10) {
        showConfetti();
    }
}

// ===== MEMORY MATCH =====
const memoryEmojis = ['🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎸', '🎺'];
let memoryState = {
    cards: [],
    flipped: [],
    matched: 0,
    moves: 0,
    startTime: 0,
    timerInterval: null
};

function startMemoryGame() {
    memoryState.cards = [...memoryEmojis, ...memoryEmojis].sort(() => Math.random() - 0.5);
    memoryState.flipped = [];
    memoryState.matched = 0;
    memoryState.moves = 0;
    memoryState.startTime = Date.now();

    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';

    memoryState.cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `<div class="card-front">${emoji}</div>`;
        card.addEventListener('click', () => flipMemoryCard(index, card, emoji));
        grid.appendChild(card);
    });

    document.getElementById('memoryMoves').textContent = 0;
    document.getElementById('memoryMatches').textContent = '0/8';
    document.getElementById('memoryTimer').textContent = 0;

    // Start timer
    memoryState.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - memoryState.startTime) / 1000);
        document.getElementById('memoryTimer').textContent = elapsed;
    }, 1000);

    stats.totalGames++;
    saveStats();
}

function flipMemoryCard(index, cardElement, emoji) {
    if (memoryState.flipped.length >= 2 || cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) {
        return;
    }

    cardElement.classList.add('flipped');
    memoryState.flipped.push({ index, element: cardElement, emoji });

    if (memoryState.flipped.length === 2) {
        memoryState.moves++;
        document.getElementById('memoryMoves').textContent = memoryState.moves;

        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryState.flipped;

    if (card1.emoji === card2.emoji) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        memoryState.matched++;
        document.getElementById('memoryMatches').textContent = `${memoryState.matched}/8`;

        if (memoryState.matched === 8) {
            clearInterval(memoryState.timerInterval);
            setTimeout(() => {
                showConfetti();
                alert(`🎉 You won! Moves: ${memoryState.moves}, Time: ${document.getElementById('memoryTimer').textContent}s`);
            }, 500);
        }
    } else {
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
    }

    memoryState.flipped = [];
}

// ===== RANDOM FACTS =====
const facts = [
    { text: "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still perfectly edible!", category: "Science" },
    { text: "A day on Venus is longer than its year. Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun!", category: "Space" },
    { text: "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills, while the third pumps it to the rest of the body!", category: "Nature" },
    { text: "The first computer programmer was a woman named Ada Lovelace in 1843, working on Charles Babbage's Analytical Engine.", category: "History" },
    { text: "Bananas are berries, but strawberries aren't! In botanical terms, a berry must develop from a flower with one ovary.", category: "Science" },
    { text: "Your brain uses about 20% of your body's energy, despite being only 2% of your body weight!", category: "Human Body" },
    { text: "The Great Wall of China is not visible from space with the naked eye, despite popular belief!", category: "Geography" },
    { text: "A group of flamingos is called a 'flamboyance'. How fitting!", category: "Animals" },
    { text: "The shortest war in history lasted only 38-45 minutes between Britain and Zanzibar in 1896.", category: "History" },
    { text: "Sharks have been around longer than trees. Sharks existed about 400 million years ago, while trees appeared around 350 million years ago.", category: "Nature" },
    { text: "The word 'computer' was originally a job title for humans who performed calculations before electronic computers!", category: "Technology" },
    { text: "Lightning strikes Earth about 100 times every second, or roughly 8 million times per day!", category: "Weather" },
    { text: "Cows have best friends and get stressed when they're separated from them.", category: "Animals" },
    { text: "The fingerprints of koalas are so similar to humans that they could potentially contaminate crime scenes!", category: "Animals" },
    { text: "There are more possible game combinations in chess than atoms in the observable universe!", category: "Math" }
];

function showRandomFact() {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('factText').textContent = fact.text;
    document.getElementById('factCategory').textContent = fact.category;

    const icons = ['🌟', '✨', '💫', '🎯', '🎪', '🎨', '🎭', '🎸'];
    document.querySelector('.fact-icon').textContent = icons[Math.floor(Math.random() * icons.length)];
}

// ===== CONFETTI =====
function showConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#fa709a'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

// Track time spent
let sessionStart = Date.now();
setInterval(() => {
    stats.totalTime += 10;
    saveStats();
}, 10000);
