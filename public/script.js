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

function startQuiz(tracks) {
  const quizContainer = document.getElementById("quizContainer");
  const loginButton = document.getElementById("loginButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const answerInput = document.getElementById("answerInput");
  const submitAnswer = document.getElementById("submitAnswer");
  const scoreDisplay = document.getElementById("score");

  loginButton.style.display = "none";
  quizContainer.style.display = "block";

  function loadTrack() {
    currentTrack = tracks[Math.floor(Math.random() * tracks.length)];
    audioPlayer.src = currentTrack.preview_url; // Charger l'extrait audio du morceau
  }

  submitAnswer.addEventListener("click", () => {
    const userAnswer = answerInput.value.toLowerCase().trim();
    const correctAnswer = currentTrack.name.toLowerCase().trim();

    // Vérifier si la réponse correspond uniquement au titre
    if (userAnswer === correctAnswer) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      alert("Correct! 🎉");
    } else {
      alert(`Wrong! The correct title was: ${currentTrack.name}`);
    }

    answerInput.value = "";
    loadTrack(); // Charger un nouveau morceau
  });

  loadTrack();
}
