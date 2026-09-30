const boxes = document.querySelectorAll(".box");
const winnerMsg = document.querySelector("#winner");
const userScoreEl = document.querySelector("#user-score");
const compScoreEl = document.querySelector("#comp-score");
const newBtn = document.querySelector("#new-btn");
const resetBtn = document.querySelector("#reset-btn");

const patterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let userScore = 0;
let compScore = 0;
let gameOver = false;
let userTurn = true;

const getWinner = () => {
  for (const [a, b, c] of patterns) {
    const v = boxes[a].innerText;
    if (v && v === boxes[b].innerText && v === boxes[c].innerText) {
      return v;
    }
  }
  return null;
};

const isFull = () => [...boxes].every((b) => b.innerText !== "");

const endCheck = () => {
  const w = getWinner();
  if (w) {
    gameOver = true;
    if (w === "X") {
      userScore++;
      userScoreEl.innerText = userScore;
      winnerMsg.innerText = "🎉Congratulation You win! 🎉";
    } else {
      compScore++;
      compScoreEl.innerText = compScore;
      winnerMsg.innerText = "🎉Congratulation Computer wins";
    }
    return true;
  }
  if (isFull()) {
    gameOver = true;
    winnerMsg.innerText = "Draw";
    return true;
  }
  return false;
};

// Kisi line mein 2 same mark + 1 khali ho to wo khali index return karta hai
const findMove = (mark) => {
  for (const line of patterns) {
    const vals = line.map((i) => boxes[i].innerText);
    if (vals.filter((v) => v === mark).length === 2 && vals.includes("")) {
      return line[vals.indexOf("")];
    }
  }
  return -1;
};

const computerMove = () => {
  if (gameOver) return;

  let idx = findMove("O");                 // pehle jeetne ki koshish
  if (idx === -1) idx = findMove("X");     // phir user ko rokna
  if (idx === -1 && boxes[4].innerText === "") idx = 4; // center
  if (idx === -1) {                        // warna random khali box
    const empty = [...boxes]
      .map((b, i) => (b.innerText === "" ? i : -1))
      .filter((i) => i !== -1);
    idx = empty[Math.floor(Math.random() * empty.length)];
  }

  boxes[idx].innerText = "O";
  boxes[idx].disabled = true;

  if (!endCheck()) {
    userTurn = true;
    winnerMsg.innerText = "Your turn";
  }
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!userTurn || gameOver || box.innerText !== "") return;

    box.innerText = "X";
    box.disabled = true;

    if (endCheck()) return;

    userTurn = false;
    winnerMsg.innerText = "Computer is thinking...";
    setTimeout(computerMove, 500);
  });
});

const newGame = () => {
  boxes.forEach((b) => {
    b.innerText = "";
    b.disabled = false;
  });
  gameOver = false;
  userTurn = true;
  winnerMsg.innerText = "Your turn";
};

newBtn.addEventListener("click", newGame);

resetBtn.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  userScoreEl.innerText = 0;
  compScoreEl.innerText = 0;
  newGame();
});