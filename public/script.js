document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/login";
});

const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");

if (access_token) {
  fetch(`/artist?access_token=${access_token}`) // Utilisation de l'endpoint /artist
    .then((response) => response.json())
    .then((tracks) => {
      const playableTracks = tracks.filter((track) => track.preview_url);
      if (playableTracks.length === 0) {
        throw new Error("No playable tracks available. Try another artist.");
      }
      const shuffledTracks = shuffleArray(playableTracks); // Mélanger les morceaux
      startQuiz(shuffledTracks);
    })
    .catch((err) => {
      console.error("Failed to fetch artist tracks:", err);
      alert(
        "Couldn't load tracks. This might be due to limitations. Please try again later."
      );
    });
}

let currentTrackIndex = 0;
let score = 0;
const maxAttempts = 8; // Nombre total de morceaux à jouer
const trackDuration = 30000; // Durée de chaque morceau en millisecondes (30 secondes)
const timeLimit = 120; // Temps total en secondes (2 minutes)
let globalTimer; // Pour gérer le temps global
let trackTimer; // Pour gérer le temps d'un morceau

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

  // Fonction pour charger un morceau
  function loadTrack() {
    if (
      currentTrackIndex >= maxAttempts ||
      currentTrackIndex >= tracks.length
    ) {
      endGame();
      return;
    }

    const currentTrack = tracks[currentTrackIndex];
    audioPlayer.src = currentTrack.preview_url;
    audioPlayer.play();
    answerInput.value = ""; // Réinitialiser la réponse utilisateur
    startTrackTimer(); // Démarrer le timer pour ce morceau
    currentTrackIndex++;
  }

  // Démarre un timer de 30 secondes pour chaque morceau
  function startTrackTimer() {
    clearTimeout(trackTimer);
    trackTimer = setTimeout(() => {
      loadTrack(); // Passe automatiquement au morceau suivant après 30 secondes
    }, trackDuration);
  }

  // Démarre le timer global (2 minutes)
  function startGlobalTimer() {
    let timeRemaining = timeLimit;

    const updateTimer = () => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerDisplay.textContent = `Time remaining: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (timeRemaining === 0) {
        clearInterval(globalTimer);
        endGame(); // Termine le jeu lorsque le temps global est écoulé
      }

      timeRemaining--;
    };

    updateTimer();
    globalTimer = setInterval(updateTimer, 1000);
  }

  // Fonction pour terminer le jeu
  function endGame() {
    clearInterval(globalTimer);
    clearTimeout(trackTimer);
    const finalScore = `Score: ${score}/${maxAttempts}`;
    if (score === maxAttempts) {
      secretSound.play();
      secretCode.textContent = "Secret Code: 0905";
      secretCodeContainer.style.display = "block";

      setTimeout(() => {
        secretCodeContainer.style.display = "none";
        alert(
          "Congratulations! You got a perfect score! I hope you remember the code."
        );
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

  // Gestion de la soumission de réponse
  submitAnswer.addEventListener("click", () => {
    clearTimeout(trackTimer); // Arrêter le timer du morceau actuel

    const userAnswer = normalizeString(answerInput.value);
    const correctAnswer = normalizeString(tracks[currentTrackIndex - 1].name);

    if (userAnswer === correctAnswer) {
      score++;
      alert("Correct! 🎉");
    } else {
      alert(
        `Wrong! The correct title was: ${tracks[currentTrackIndex - 1].name}`
      );
    }

    scoreDisplay.textContent = `Score: ${score}/${maxAttempts}`;
    loadTrack(); // Charger le morceau suivant
  });

  // Fonction pour normaliser les chaînes avant comparaison
  function normalizeString(str) {
    return str.toLowerCase().trim().replace(/[’'"]/g, "");
  }

  loadTrack(); // Charger le premier morceau
  startGlobalTimer(); // Démarrer le timer global
}

// Fonction pour mélanger les morceaux
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
