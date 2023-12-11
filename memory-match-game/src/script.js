document.addEventListener("DOMContentLoaded", () => {
    const cards = Array.from(document.querySelectorAll(".card"));
    const readyOverlay = document.getElementById("readyOverlay");
    const readyButton = document.getElementById("readyButton");

    let selectedCards = [];
    let matchesFound = 0;
    let timerInterval;
    let timerStarted = false;
    let isGameOver = false;
    let countdownDuration = 80;
    let targetTime;
    let flipBackTimeout;

    readyButton.addEventListener("click", () => {
    readyOverlay.style.display = "none";
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (backgroundMusic) {
        backgroundMusic.play();
    }

    // Initial order of cards
    cards.forEach((card, index) => {
        card.style.order = index;
    });

    shuffleCards(cards);

    cards.forEach((card) => {
        card.addEventListener("click", flipCard);
    });

    // Reset Button
    document.getElementById("resetButton").addEventListener("click", resetGame);

    // Show All Button
    document.getElementById("showAllButton").addEventListener("click", showAllCards);

    function startTimer() {
        targetTime = new Date(new Date().getTime() + countdownDuration * 1000);
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    function updateTimer() {
        const currentTime = new Date();
        const timeLeft = new Date(targetTime - currentTime);
        const minutes = timeLeft.getUTCMinutes();
        const seconds = timeLeft.getUTCSeconds();

        if (timeLeft.getTime() <= 0) {
            stopTimer();
            document.getElementById("timer").textContent = "0:00";
            showModal("timeUpModal");
            document.getElementById('timeUpSound').play();
            isGameOver = true;
        } else {
            document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        stopTimer();
        targetTime = new Date(new Date().getTime() + countdownDuration * 1000);
        document.getElementById("timer").textContent = formatTime(countdownDuration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }

    function shuffleCards(cards) {
        for (let i = cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i].style.order, cards[j].style.order] = [cards[j].style.order, cards[i].style.order];
        }
        resetTimer();
    }

    function flipCard() {
        if (isGameOver || selectedCards.length === 2 || this.classList.contains("flipped")) {
            return;
        }
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        this.classList.add("flipped");
        selectedCards.push(this);

        if (selectedCards.length === 1) {
            clearTimeout(flipBackTimeout);
            flipBackTimeout = setTimeout(() => {
                selectedCards[0].classList.remove("flipped");
                selectedCards = [];
            }, 1000);
        } else if (selectedCards.length === 2) {
            checkForMatch();
        }
        document.getElementById('flipSound').play();
    }

    function checkForMatch() {
        const [card1, card2] = selectedCards;
        clearTimeout(flipBackTimeout);
        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            document.getElementById('matchSound').play();
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchesFound += 2;
            selectedCards = [];

            if (matchesFound === cards.length) {
                setTimeout(() => {
                    showModal("successModal");
                    document.getElementById('winSound').play();
                }, 200);
            }
        } else {
            card1.classList.add("mismatched");
            card2.classList.add("mismatched");
            setTimeout(() => {
                card1.classList.remove("flipped", "mismatched");
                card2.classList.remove("flipped", "mismatched");
                selectedCards = [];
            }, 500);
        }
    }

    function showModal(modalId) {
        const modalToShow = document.getElementById(modalId);
        modalToShow.style.display = 'flex';
        stopTimer();
        isGameOver = true;
    }

    // Close button for success modal
    const successModalCloseButton = document.querySelector('#successModal .close-button');
    successModalCloseButton.onclick = function() {
        document.getElementById('successModal').style.display = "none";
        resetTimer();
        isGameOver = false;
    }

    // Close button for time up modal
    const timeUpModalCloseButton = document.querySelector('#timeUpModal .close-button');
    timeUpModalCloseButton.onclick = function() {
        document.getElementById('timeUpModal').style.display = "none";
        resetGame();
        isGameOver = false;
    }

    document.getElementById('playAgainButton').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
        resetGame();
    });
    document.getElementById('tryAgainButton').addEventListener('click', function() {
        document.getElementById('timeUpModal').style.display = 'none';
        resetGame();
    });

    function resetGame() {
        selectedCards = [];
        matchesFound = 0;
        timerStarted = false;
        isGameOver = false;
        cards.forEach((card) => {
            card.classList.remove("flipped", "matched", "mismatched");
        });
        shuffleCards(cards);
        resetTimer();
    }

    function showAllCards() {
        cards.forEach((card) => {
            card.classList.add("flipped");
        });
        resetTimer();
    }
});

document.getElementById('muteButton').addEventListener('click', function() {
    let audios = document.querySelectorAll('audio');
    let isMuted = audios[0].muted;
    audios.forEach(audio => {
        audio.muted = !isMuted;
    });

    if (isMuted) {
        this.classList.remove('fa-volume-mute');
        this.classList.add('fa-volume-up');
    } else {
        this.classList.remove('fa-volume-up');
        this.classList.add('fa-volume-mute');
    }
});

});

// Burst animation
setInterval(() => randomizedConfetti(), 500);

function bursty(x, y) {
    const burst = new mojs.Burst({
        left: 0,
        top: 0,
        radius: { 0: 200 },
        count: 20,
        degree: 360,
        children: {
            fill: { white: "#34E1FF" },
            duration: 2000
        }
    }).tune({
        x: x,
        y: y
    });

    burst.replay();
}

function randomizedConfetti() {
    let randomX = Math.floor(Math.random() * (document.body.clientWidth - 100) + 0);
    let randomY = Math.floor(Math.random() * (window.innerHeight - 200) + 0);
    const burst = new mojs.Burst({
        left: 0,
        top: 0,
        radius: { 0: 200 },
        count: 20,
        degree: 360,
        children: {
            fill: { white: "#34E1FF" },
            duration: 2000
        }
    }).tune({
        x: randomX,
        y: randomY
    });

    burst.replay();
}

Splitting();
