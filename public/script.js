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
let timer = null; // Référence pour le timer

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

  // Initialisation du message et de l'interface
  loginButton.style.display = "none";
  quizContainer.style.display = "block";
  infoMessage.textContent = "Get a score of 8 to unlock the code"; // Message permanent

  // Fonction pour charger un morceau
  function loadTrack() {
    currentTrack = tracks[Math.floor(Math.random() * tracks.length)];
    audioPlayer.src = currentTrack.preview_url; // Charger l'extrait audio du morceau
  }

  // Fonction pour mettre à jour le timer
  function startTimer(durationInSeconds) {
    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timer";
    timerDisplay.textContent = "Time remaining: 10:00";
    quizContainer.insertBefore(timerDisplay, quizContainer.firstChild);

    let timeRemaining = durationInSeconds;

    timer = setInterval(() => {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      timerDisplay.textContent = `Time remaining: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (timeRemaining === 0) {
        clearInterval(timer); // Arrêter le timer
        endGame(); // Terminer le jeu
      }

      timeRemaining--;
    }, 1000);
  }

  // Fonction pour terminer le jeu
  function endGame() {
    alert(`Time's up! Your final score is: ${score}`);
    quizContainer.innerHTML = `<h2>Game Over</h2><p>Your final score: ${score}</p>`;
  }

  // Fonction pour afficher le code secret si le score dépasse 7
  function checkScoreForSecretCode() {
    if (score > 7) {
      secretSound.play(); // Jouer le son "C'est le H"
      secretCode.textContent = "Secret Code: 0905";
      secretCodeContainer.style.display = "block";

      // Cache le code après 2 secondes
      setTimeout(() => {
        secretCodeContainer.style.display = "none";
      }, 2000);
    }
  }

  // Gestion de la soumission de réponse
  submitAnswer.addEventListener("click", () => {
    const userAnswer = answerInput.value.toLowerCase().trim();
    const correctAnswer = currentTrack.name.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      alert("Correct! 🎉");
      checkScoreForSecretCode(); // Vérifie si le score est supérieur à 7
    } else {
      alert(`Wrong! The correct title was: ${currentTrack.name}`);
    }

    answerInput.value = "";
    loadTrack(); // Charger un nouveau morceau
  });

  loadTrack();
  startTimer(600); // Démarrer le timer pour 10 minutes (600 secondes)
}
