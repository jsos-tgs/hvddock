document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/login";
});

const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");

if (access_token) {
  fetch(`/artist?access_token=${access_token}`) // Utilisation de l'endpoint /artist
    .then((response) => response.json())
    .then((tracks) => {
      startQuiz(tracks);
    })
    .catch((err) => {
      console.error("Failed to fetch artist tracks:", err);
      alert("Could not load tracks. Please try again.");
    });
}

let currentTrack = null;
let score = 0;
let attempts = 0;
const maxAttempts = 8; // Nombre total de morceaux à jouer
const timeLimit = 180; // Limite de temps en secondes (3 minutes)

function startQuiz(tracks) {
  const quizContainer = document.getElementById("quizContainer");
  const loginButton = document.getElementById("loginButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const answerInput = document.getElementById("answerInput");
  const submitAnswer = document.getElementById("submitAnswer");
  const scoreDisplay = document.getElementById("score");
  const secretCodeContainer = document.getElementById("secretCodeContainer");
  const secretCode = document.getElementById("secretCode");
  const secretSound = document.getElementById("secretSound");
  const infoMessage = document.getElementById("infoMessage");
  const timerDisplay = document.createElement("div");

  timerDisplay.id = "timer";
  quizContainer.insertBefore(timerDisplay, quizContainer.firstChild);

  // Initialisation de l'interface
  loginButton.style.display = "none";
  quizContainer.style.display = "block";
  infoMessage.textContent = "Get a score of 8 to unlock the code";

  // Fonction pour normaliser les chaînes avant comparaison
  function normalizeString(str) {
    return str.toLowerCase().trim().replace(/[’'"]/g, ""); // Remplacer les apostrophes et guillemets
  }

  // Fonction pour charger un morceau
  function loadTrack() {
    if (attempts >= maxAttempts) {
      endGame();
      return;
    }
    currentTrack = tracks[Math.floor(Math.random() * tracks.length)];
    audioPlayer.src = currentTrack.preview_url; // Charger l'extrait audio
    attempts++;
  }

  // Fonction pour mettre à jour le timer
  function startTimer(durationInSeconds) {
    let timeRemaining = durationInSeconds;

    const updateTimer = () => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerDisplay.textContent = `Time remaining: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (timeRemaining === 0) {
        clearInterval(timer);
        endGame(); // Terminer le jeu automatiquement à la fin du temps
      }

      timeRemaining--;
    };

    updateTimer(); // Mise à jour initiale
    timer = setInterval(updateTimer, 1000);
  }

  // Fonction pour terminer le jeu
  function endGame() {
    clearInterval(timer); // Arrêter le timer
    const finalScore = `Score: ${score}/${maxAttempts}`;
    if (score === maxAttempts) {
      secretSound.play(); // Jouer le son
      secretCode.textContent = "Secret Code: 0905";
      secretCodeContainer.style.display = "block";

      // Cache le code après 2 secondes
      setTimeout(() => {
        secretCodeContainer.style.display = "none";
        alert("Congratulations! You got a perfect score!");
        quizContainer.innerHTML = `
          <h2>You finished the game!</h2>
          <p>Your score: ${finalScore}</p>`;
      }, 2000);
    } else {
      quizContainer.innerHTML = `
        <h2>You finished the game!</h2>
        <p>Your score: ${finalScore}</p>
        <p>Try again to improve your score!</p>`;
    }
  }

  // Vérifie si le score atteint le seuil pour débloquer le code
  function checkScoreForSecretCode() {
    if (score === maxAttempts) {
      endGame();
    }
  }

  // Gestion de la soumission de réponse
  submitAnswer.addEventListener("click", () => {
    const userAnswer = normalizeString(answerInput.value);
    const correctAnswer = normalizeString(currentTrack.name);

    if (userAnswer === correctAnswer) {
      score++;
      alert("Correct! 🎉");
    } else {
      alert(`Wrong! The correct title was: ${currentTrack.name}`);
    }

    scoreDisplay.textContent = `Score: ${score}/${maxAttempts}`; // Affiche le score actualisé
    answerInput.value = "";
    loadTrack(); // Charger le morceau suivant
  });

  loadTrack(); // Charger le premier morceau
  startTimer(timeLimit); // Démarrer le timer pour 3 minutes
}
