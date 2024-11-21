document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/login";
});

const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");

if (access_token) {
  fetch(`/tracks?access_token=${access_token}`)
    .then((response) => response.json())
    .then((tracks) => {
      startQuiz(tracks);
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
document.getElementById("loginButton").addEventListener("click", () => {
  window.location.href = "/login";
});

const urlParams = new URLSearchParams(window.location.search);
const access_token = urlParams.get("access_token");

if (access_token) {
  document.getElementById("playlistForm").style.display = "block";

  document.getElementById("loadPlaylist").addEventListener("click", () => {
    const playlistId =
      document.getElementById("playlistId").value || "37i9dQZF1DXcBWIGoYBM5M"; // Playlist par défaut
    fetch(`/playlist?access_token=${access_token}&playlist_id=${playlistId}`)
      .then((response) => response.json())
      .then((tracks) => {
        startQuiz(tracks);
      })
      .catch((err) => {
        alert("Failed to load playlist. Please check the Playlist ID.");
        console.error(err);
      });
  });
}

let currentTrack = null;
let score = 0;

function startQuiz(tracks) {
  const quizContainer = document.getElementById("quizContainer");
  const playlistForm = document.getElementById("playlistForm");
  const audioPlayer = document.getElementById("audioPlayer");
  const answerInput = document.getElementById("answerInput");
  const submitAnswer = document.getElementById("submitAnswer");
  const scoreDisplay = document.getElementById("score");

  playlistForm.style.display = "none";
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
