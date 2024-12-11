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
    title: "Bodies",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/GAZO%20-%20BODIES%20(Ft%20Damso)%20(Visualizer).mp3?v=1733503426438",
  },
  {
    title: "Becte",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/GAZO%20-%20BECTE%20(Visualizer).mp3?v=1733503437992",
  },
  {
    title: "Iluv",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20iLUV.mp3?v=1733503452635",
  },
  {
    title: "Pop",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20POP%20(feat.%20La%20Mano%201.9).mp3?v=1733503466587",
  },
  {
    title: "Sevice",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20SEVICE.mp3?v=1733503474761",
  },
  {
    title: "Wayans",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20WAYANS.mp3?v=1733503485970",
  },
  {
    title: "Optimale",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20OPTIMALE%20feat.%20%40orelsan.mp3?v=1733503497968",
  },
  {
    title: "Fiesta",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20FIESTA%20feat.%20%40MDLR1%20(Clip%20Officiel).mp3?v=1733503510766",
  },
  {
    title: "Probation",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20PROBATION.mp3?v=1733503524969",
  },
  {
    title: "Birthday",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20BIRTHDAY%20feat.%20%40jul_detp.mp3?v=1733503538288",
  },
  {
    title: "Wemby",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20WEMBY%20feat.%20%40OFFSETYRN.mp3?v=1733503548004",
  },
  {
    title: "Pure codei",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20PURE%20CODEI%20feat.%20%40yamebantu.mp3?v=1733503563555",
  },
  {
    title: "Nanani nanana",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20NANANI%20NANANA.mp3?v=1733503576601",
  },
  {
    title: "Selele",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20SELELE%20feat.%20%40fallyipupa.mp3?v=1733503594329",
  },
  {
    title: "La belle et la bete",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20LA%20BELLE%20ET%20LA%20BE%CC%82TE.mp3?v=1733503610771",
  },
  {
    title: "Encore plus fort elle aime ca",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/GAZO%20-%20ENCORE%20PLUS%20FORT%20ELLE%20AIME%20C%CC%A7A.mp3?v=1733503623867",
  },
  {
    title: "Toki",
    file: "https://cdn.glitch.global/f9c97d8f-d33e-4132-9fe4-f58a4057462b/Gazo%20-%20TOKI.mp3?v=1733503636591",
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
