const startButton = document.getElementById('startButton');
const wordDisplay = document.getElementById('wordDisplay');
const timerSelect = document.getElementById('timer');

let timer;
let timeLeft;
let timerRunning = false;
let words = [];

fetch('words.txt') // Замените на путь к вашему текстовому файлу
    .then(response => response.text())
    .then(text => {
        words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    });

function startTimer() {
    if (timerRunning) return;

    timeLeft = parseInt(timerSelect.value);
    timerRunning = true;
    startButton.classList.add('red');
    startButton.innerText = ''; // Убираем слово "Время"
    wordDisplay.innerText = ''; // Убираем старую надпись
    let count = 0;
    
    timer = setInterval(() => {
        count++;
        startButton.innerText = count; // Отображаем прямой отсчет времени

        if (count % 10 === 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            wordDisplay.innerText = randomWord;
            wordDisplay.style.fontSize = 'calc(150% + 15%)'; // Увеличиваем на 15%
        }

        if (count === timeLeft) {
            clearInterval(timer);
            startButton.classList.remove('red');
            startButton.innerText = 'Поехали';
            wordDisplay.innerText = 'Это было круто!';
            timerRunning = false;
        }
    }, 1000);
}

startButton.addEventListener('click', () => {
    if (!timerRunning) {
        startTimer(); // Начинаем игру
    } else {
        // Если игра уже идет, сбрасываем ее и начинаем заново
        clearInterval(timer);
        wordDisplay.innerText = ''; // Убираем надпись "Это было круто!"
        startTimer(); // Запускаем игру заново
    }
});









