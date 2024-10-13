// Selecting elements
const startGameButton = document.getElementById('startGameButton');
const homeButton = document.getElementById('homeButton');
const homePage = document.getElementById('homePage');
const gamePage = document.getElementById('gamePage');
const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const resultParagraph = document.getElementById('result');
const choices = document.querySelectorAll('.choice');
const resetButton = document.getElementById('resetButton');
const sound = document.getElementById('celebration-sound'); // Get the audio element

let userScore = 0;
let computerScore = 0;
let confettiInterval; // Declare this variable at a higher scope

function startGame() {
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    resultParagraph.textContent = "Make your move!";
    homePage.style.display = "none";
    gamePage.style.display = "block";
    enableChoices(); // Enable choices when starting a new game
}

function goHome() {
    homePage.style.display = "block";
    gamePage.style.display = "none";
    sound.pause(); // Stop the audio
    sound.currentTime = 0; // Reset audio to start
    clearInterval(confettiInterval); // Stop the confetti effect
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function getResult(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return "draw";
    }
    if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
    ) {
        return "win";
    }
    return "lose";
}

function showResult(result, userChoice, computerChoice) {
    if (result === "win") {
        userScore++;
        userScoreSpan.textContent = userScore;
        resultParagraph.textContent = `You win! ${userChoice} beats ${computerChoice}`;
    } else if (result === "lose") {
        computerScore++;
        computerScoreSpan.textContent = computerScore;
        resultParagraph.textContent = `You lose! ${computerChoice} beats ${userChoice}`;
    } else {
        resultParagraph.textContent = `It's a draw! You both chose ${userChoice}`;
    }
    
    checkWinner();
}

function checkWinner() {
    if (userScore === 3) {
        resultParagraph.textContent = "Congratulations! You reached 3 points and won the game!";
        disableChoices(); // Disable choices when the user wins
        celebrate(); // Trigger celebration effect
    } else if (computerScore === 3) {
        resultParagraph.textContent = "Computer reached 3 points. You lose the game.";
        disableChoices(); // Disable choices when the computer wins
    }
}

function celebrate() {
    // Play celebratory sound
    sound.currentTime = 0; // Reset sound to start
    sound.play();

    // Change background color for celebration
    document.body.style.transition = "background-color 1s ease";
    document.body.style.backgroundColor = "gold";

    // Trigger confetti effect
    const count = 200; // More confetti particles for a bigger effect

    const launchConfetti = () => {
        confetti({
            particleCount: count,
            spread: 100,
            origin: { y: 0.6 },
            startVelocity: 25,
            drift: 0.6,
            gravity: 0.8,
            ticks: 500,
            duration: 3000,
        });
    };

    launchConfetti();
    confettiInterval = setInterval(launchConfetti, 1000); // Store the interval ID

}

function animateScoreDisplay() {
    userScoreSpan.style.transition = "transform 0.5s";
    userScoreSpan.style.transform = "scale(1.5)";
    setTimeout(() => {
        userScoreSpan.style.transform = "scale(1)";
    }, 500);
}

function disableChoices() {
    choices.forEach(choice => {
        choice.style.pointerEvents = "none"; // Disable interaction
        choice.style.opacity = "0.5"; // Make choices appear disabled
    });
}

function enableChoices() {
    choices.forEach(choice => {
        choice.style.pointerEvents = "auto"; // Enable interaction
        choice.style.opacity = "1"; // Reset opacity
    });
}

function game(userChoice) {
    const computerChoice = getComputerChoice();
    const result = getResult(userChoice, computerChoice);
    showResult(result, userChoice, computerChoice);
}

function resetGame() {
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    resultParagraph.textContent = "Make your move!";
    enableChoices(); // Re-enable choices
    document.body.style.backgroundColor = ""; // Reset to original background color
    clearInterval(confettiInterval); // Ensure confetti is stopped on reset
    sound.pause(); // Stop the audio
    sound.currentTime = 0; // Reset audio to start
}

// Event Listeners
startGameButton.addEventListener('click', startGame);
homeButton.addEventListener('click', goHome);
resetButton.addEventListener('click', resetGame);
choices.forEach(choice => choice.addEventListener('click', function() {
    if (userScore < 3 && computerScore < 3) { // Check if the game is still ongoing
        game(this.id);
    }
}));
