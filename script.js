document.addEventListener("DOMContentLoaded", () => {
  const chooseCharacterButton = document.getElementById("chooseCharacterButton");
  const chooseTimeSection = document.getElementById("chooseTimeSection");
  const startGameSection = document.getElementById("startGameSection");
  const startButton = document.getElementById("startButton");
  const wordDisplay = document.getElementById("wordDisplay");
  const endMessage = document.getElementById("endMessage");
  const soundStart = document.getElementById("soundStart");
  const soundEnd = document.getElementById("soundEnd");

  const timeButtons = {
    "60secButton": 60,
    "90secButton": 90,
  };

  let words = [];
  let interval;
  let timeLeft;
  let timerRunning = false;

  // Загрузка слов из файла words.txt
  fetch("words.txt")
    .then((response) => response.text())
    .then((data) => {
      words = data.split("\n").filter((word) => word.trim() !== "");
    })
    .catch((error) => console.error("Ошибка загрузки файла:", error));

  // Функция для озвучивания слова
  function speakWord(word) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "ru-RU"; // Устанавливаем язык (русский)
      utterance.rate = 1; // Скорость речи (1 - нормальная)
      utterance.pitch = 1; // Высота голоса (1 - нормальная)
      utterance.volume = 2; // Увеличиваем громкость в 2 раза (максимум 1, но можно попробовать)
      speechSynthesis.speak(utterance);
    } else {
      console.warn("Ваш браузер не поддерживает синтез речи.");
    }
  }

  // Обработчик кнопки "Я выбрал!"
  chooseCharacterButton.addEventListener("click", () => {
    chooseCharacterButton.style.backgroundColor = "#fa8072"; // Лососевый цвет
    chooseTimeSection.classList.remove("hidden");
  });

  // Обработчики кнопок выбора времени
  Object.keys(timeButtons).forEach((buttonId) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
      // Меняем цвет всех кнопок времени на синий
      document.querySelectorAll(".time-button").forEach((btn) => {
        btn.style.backgroundColor = "#4682b4";
      });
      // Меняем цвет выбранной кнопки на лососевый
      button.style.backgroundColor = "#fa8072";
      timeLeft = timeButtons[buttonId];
      startGameSection.classList.remove("hidden");
    });
  });

  // Обработчик кнопки "Поехали!"
  startButton.addEventListener("click", () => {
    if (timerRunning) return;

    // Уменьшаем громкость начального звука в 2 раза
    soundStart.volume = 0.5; // Громкость 50%
    soundStart.play(); // Звуковой сигнал начала

    startButton.style.backgroundColor = "#fa8072"; // Лососевый цвет
    timerRunning = true;
    startButton.textContent = timeLeft;
    wordDisplay.classList.add("hidden"); // Скрываем слово перед началом игры

    // Запускаем таймер
    const timerInterval = setInterval(() => {
      timeLeft--;
      startButton.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(interval);
        soundEnd.play(); // Звуковой сигнал окончания
        startButton.style.backgroundColor = "#8fbc8f"; // Возвращаем зеленый цвет
        startButton.textContent = "Поехали!";
        wordDisplay.classList.add("hidden");
        endMessage.classList.remove("hidden");
        timerRunning = false;
      }
    }, 1000);

    // Показываем первое слово через 10 секунд
    setTimeout(() => {
      if (timeLeft > 0) { // Проверяем, что время не истекло
        const firstWord = getRandomWord();
        wordDisplay.textContent = firstWord;
        wordDisplay.classList.remove("hidden");
        speakWord(firstWord); // Озвучиваем первое слово

        // Запускаем интервал для следующих слов
        interval = setInterval(() => {
          if (timeLeft > 10) { // Не показываем слово на последних 10 секундах
            const randomWord = getRandomWord();
            wordDisplay.textContent = randomWord;
            speakWord(randomWord); // Озвучиваем каждое новое слово
          } else if (timeLeft <= 10) {
            wordDisplay.classList.add("hidden"); // Скрываем слово на последних 10 секундах
          }
        }, 10000);
      }
    }, 10000);
  });

  // Функция для получения случайного слова
  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }
});