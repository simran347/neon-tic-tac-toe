const boxes = [...document.querySelectorAll(".box")];
const resetBtn = document.querySelector("#reset-btn");
const newGameBtn = document.querySelector("#new-btn");
const turnIndicator = document.querySelector("#turn-indicator");
const turnText = document.querySelector("#turn-text");
const scoreXEl = document.querySelector("#score-x");
const scoreOEl = document.querySelector("#score-o");
const scoreDrawEl = document.querySelector("#score-draw");
const toast = document.querySelector("#toast");

let currentPlayer = "O";
let gameOver = false;
let scores = { X: 0, O: 0, draw: 0 };

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function updateTurn() {
  turnIndicator.textContent = currentPlayer;
  turnIndicator.classList.toggle("x-turn", currentPlayer === "X");
  turnText.textContent = `Player ${currentPlayer}'s turn`;
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.draw;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hide");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.add("hide"), 2400);
}

function finishRound(message) {
  gameOver = true;
  turnText.textContent = message;
  turnIndicator.textContent = "✓";
  turnIndicator.classList.remove("x-turn");
  boxes.forEach(box => box.disabled = true);
}

function checkWinner() {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (boxes[a].textContent &&
        boxes[a].textContent === boxes[b].textContent &&
        boxes[a].textContent === boxes[c].textContent) {
      pattern.forEach(index => boxes[index].classList.add("winner"));
      const winner = boxes[a].textContent;
      scores[winner]++;
      updateScores();
      finishRound(`Player ${winner} wins!`);
      showToast(`✨ Player ${winner} wins the round!`);
      return true;
    }
  }

  if (boxes.every(box => box.textContent !== "")) {
    scores.draw++;
    updateScores();
    finishRound("It's a draw!");
    showToast("🤝 It's a draw! Great game.");
    return true;
  }
  return false;
}

function playMove(box) {
  if (gameOver || box.textContent) return;
  box.textContent = currentPlayer;
  box.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  box.disabled = true;
  if (checkWinner()) return;
  currentPlayer = currentPlayer === "O" ? "X" : "O";
  updateTurn();
}

function resetRound() {
  currentPlayer = "O";
  gameOver = false;
  boxes.forEach(box => {
    box.textContent = "";
    box.disabled = false;
    box.classList.remove("mark-x", "mark-o", "winner");
  });
  updateTurn();
  toast.classList.add("hide");
}

function newMatch() {
  scores = { X: 0, O: 0, draw: 0 };
  updateScores();
  resetRound();
  showToast("New match started. Good luck!");
}

boxes.forEach(box => box.addEventListener("click", () => playMove(box)));
resetBtn.addEventListener("click", resetRound);
newGameBtn.addEventListener("click", newMatch);
updateTurn();
updateScores();
