document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/login";
});

const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");

if (access_token) {
  fetch(`/playlist?access_token=${access_token}`) // Utilisation de l'endpoint /playlist
    .then((response) => response.json())
    .then((tracks) => {
      startQuiz(tracks);
    })
    .catch((err) => {
      console.error("Failed to fetch playlist tracks:", err);
      alert("Could not load the playlist. Please try again.");
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
    audioPlayer.src = currentTrack.preview_url;
  }

  submitAnswer.addEventListener("click", () => {
    const userAnswer = answerInput.value.toLowerCase();
    if (
      userAnswer.includes(currentTrack.name.toLowerCase()) ||
      userAnswer.includes(currentTrack.artist.toLowerCase())
    ) {
      score++;
    }
    scoreDisplay.textContent = `Score: ${score}`;
    answerInput.value = "";
    loadTrack();
  });

  loadTrack();
}
