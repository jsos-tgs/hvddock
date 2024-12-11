document.getElementById("loginButton").addEventListener("click", () => {
  startQuiz(audioTracks); // Commencer le jeu avec les fichiers audio locaux
});

const audioTracks = [
  {
    title: "Biff",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/BIFF.mp3?v=1733910470840",
  },
  {
    title: "Nicotine",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/Nicotine.mp3?v=1733910482563",
  },
  {
    title: "La nuit",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/La%20Nuit.mp3?v=1733910487551",
  },
  {
    title: "Chrysalide",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/CHRYSALIDE.mp3?v=1733910492716",
  },
  {
    title: "Glow",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/GLOW.mp3?v=1733910497910",
  },
  {
    title: "WNT",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/WNT.mp3?v=1733910503081",
  },
  {
    title: "c'est pas un mythe",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/CEST%20PAS%20UN%20MYTHE.mp3?v=1733910509732",
  },
  {
    title: "Tout ce qu'on fait",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/TOUT%20CE%20QUON%20FAIT.mp3?v=1733910526837",
  },
  {
    title: "Intense",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/INTENSE.mp3?v=1733910535059",
  },
  {
    title: "Badman",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/BADMAN.mp3?v=1733910539966",
  },
  {
    title: "Flame",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/FLAME.mp3?v=1733910544873",
  },
  {
    title: "Mirage interlude",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/MIRAGE%20INTERLUDE.mp3?v=1733910550274",
  },
  {
    title: "Ma line",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/MA%20LINE.mp3?v=1733910555587",
  },
  {
    title: "Hier",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/HIER.mp3?v=1733910560961",
  },
  {
    title: "Sans appel",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/SANS%20APPEL.mp3?v=1733910571154",
  },
  {
    title: "Nobody",
    file: "https://cdn.glitch.global/cb8e26fe-fefc-49d6-9e8b-7d903694f76e/NOBODY.mp3?v=1733910574824",
  },
];
let currentTrackIndex = 0;
let playedTracks = new Set();
let score = 0;
const maxAttempts = 8; // Nombre total de morceaux à jouer
const trackDuration = 30000; // Durée d'écoute de chaque morceau en millisecondes
const totalGameTime = 120000; // Temps total en millisecondes (2 minutes)
let trackTimer;
let globalTimer;
let progressBarInterval;
const audioPlayer = new Audio();
const secretCode = "7954";

// Fonction de normalisation des caractères
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[`’‘´']/g, "'") // Normalise les apostrophes
    .replace(/\s+/g, " ") // Normalise les espaces
    .trim(); // Supprime les espaces en début et fin
}

// Lancer le quiz
function startQuiz(tracks) {
  const quizContainer = document.getElementById("quizContainer");
  const loginButton = document.getElementById("loginButton");
  const answerInput = document.getElementById("answerInput");
  const submitAnswer = document.getElementById("submitAnswer");
  const scoreDisplay = document.getElementById("score");
  const timeRemainingDisplay = document.getElementById("timeRemaining");
  const progressBarFill = document.getElementById("progressFill");

  loginButton.style.display = "none";
  quizContainer.style.display = "block";
  scoreDisplay.textContent = `Score: ${score}/${maxAttempts}`;

  let remainingTime = totalGameTime;

  // Charger une piste audio
  function loadTrack() {
    clearTimeout(trackTimer);
    resetProgressBar();

    if (
      playedTracks.size >= tracks.length ||
      score >= maxAttempts ||
      remainingTime <= 0
    ) {
      endGame();
      return;
    }

    do {
      currentTrackIndex = Math.floor(Math.random() * tracks.length);
    } while (playedTracks.has(currentTrackIndex));

    playedTracks.add(currentTrackIndex);
    const currentTrack = tracks[currentTrackIndex];
    audioPlayer.src = currentTrack.file;
    audioPlayer.load();

    audioPlayer
      .play()
      .then(() => console.log(`Playing: ${currentTrack.title}`))
      .catch((error) => {
        console.error("Audio playback failed:", error);
        loadTrack();
      });

    startTrackTimer();
  }

  // Timer par piste
  function startTrackTimer() {
    let elapsedTime = 0;

    progressBarInterval = setInterval(() => {
      elapsedTime += 100;
      const progress = (elapsedTime / trackDuration) * 100;
      progressBarFill.style.width = `${progress}%`;

      if (elapsedTime >= trackDuration) {
        clearInterval(progressBarInterval);
        loadTrack();
      }
    }, 100);

    trackTimer = setTimeout(() => {
      loadTrack();
    }, trackDuration);
  }

  // Réinitialiser la barre de progression
  function resetProgressBar() {
    clearInterval(progressBarInterval);
    progressBarFill.style.width = "0%";
  }

  // Gestion du temps restant
  globalTimer = setInterval(() => {
    remainingTime -= 1000;
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    timeRemainingDisplay.textContent = `Time remaining: ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (remainingTime <= 0) {
      clearInterval(globalTimer);
      endGame();
    }
  }, 1000);

  // Gestion de la soumission de réponse
  submitAnswer.addEventListener("click", () => {
    const userAnswer = normalizeString(answerInput.value);
    const correctAnswer = normalizeString(tracks[currentTrackIndex].title);

    if (userAnswer === correctAnswer) {
      score++;
      scoreDisplay.textContent = `Score: ${score}/${maxAttempts}`;
      alert("Correct! 🎉");
    } else {
      alert(
        `Wrong! The correct answer was: ${tracks[currentTrackIndex].title}`
      );
    }

    answerInput.value = "";
    clearTimeout(trackTimer);
    loadTrack();
  });

  // Fin du jeu
  function endGame() {
    clearTimeout(trackTimer);
    clearInterval(progressBarInterval);
    clearInterval(globalTimer);

    if (score === maxAttempts) {
      alert("You win! I hope you remembered the code!");
      quizContainer.innerHTML = `
        <h2>Game Over</h2>
        <p>Your final score: ${score}/${maxAttempts}</p>
        <p>Code: ${secretCode}</p>
      `;
    } else {
      quizContainer.innerHTML = `
        <h2>Game Over</h2>
        <p>Your final score: ${score}/${maxAttempts}</p>
        <p>Thank you for playing!</p>
      `;
    }
  }

  loadTrack();
}
