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

  // Initialisation de l'interface
  loginButton.style.display = "none";
  quizContainer.style.display = "block";
  infoMessage.textContent = "Get a score of 8 to unlock the code"; // Message permanent

  // Fonction pour normaliser les chaînes avant comparaison
  function normalizeString(str) {
    return str
      .toLowerCase() // Convertir en minuscules
      .trim() // Supprimer les espaces superflus
      .replace(/[’'"]/g, ""); // Remplacer les apostrophes et guillemets pour uniformiser
  }

  // Fonction pour charger un morceau
  function loadTrack() {
    currentTrack = tracks[Math.floor(Math.random() * tracks.length)];
    audioPlayer.src = currentTrack.preview_url; // Charger l'extrait audio du morceau
  }

  // Fonction pour mettre à jour le timer
  function startTimer(durationInSeconds) {
    const timerDisplay = document.createElement("div");
    timerDisplay.id = "timer";
    timerDisplay.textContent = "Time remaining: 5:00"; // Durée initiale pour 5 minutes
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
    clearInterval(timer); // Assurez-vous que le timer est arrêté
    quizContainer.innerHTML = `
      <h2>You finished the quiz!</h2>
      <p>We're glad you really know HVDDOCK.</p>`;
  }

  // Fonction pour afficher le code secret et arrêter le jeu lorsque le score atteint 8
  function checkScoreForSecretCode() {
    if (score === 8) {
      clearInterval(timer); // Arrêter le timer
      secretSound.play(); // Jouer le son "C'est le H"
      secretCode.textContent = "Secret Code: 0905";
      secretCodeContainer.style.display = "block";

      // Cache le code après 2 secondes
      setTimeout(() => {
        secretCodeContainer.style.display = "none";
        alert("Congratulations! I hope you remembered the code.");
        endGame(); // Terminer le jeu
      }, 2000);
    }
  }

  // Gestion de la soumission de réponse
  submitAnswer.addEventListener("click", () => {
    const userAnswer = normalizeString(answerInput.value); // Normaliser la réponse utilisateur
    const correctAnswer = normalizeString(currentTrack.name); // Normaliser le titre du morceau

    if (userAnswer === correctAnswer) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      alert("Correct! 🎉");
      checkScoreForSecretCode(); // Vérifie si le score atteint 8
    } else {
      alert(`Wrong! The correct title was: ${currentTrack.name}`);
    }

    answerInput.value = "";
    loadTrack(); // Charger un nouveau morceau
  });

  loadTrack();
  startTimer(300); // Démarrer le timer pour 5 minutes (300 secondes)
}
