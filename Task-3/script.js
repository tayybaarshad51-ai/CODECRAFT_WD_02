const cells = document.querySelectorAll(".cell");

const statusText = document.getElementById("status");

const resetBtn = document.getElementById("resetBtn");

const twoPlayerBtn = document.getElementById("twoPlayerBtn");
const aiBtn = document.getElementById("aiBtn");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawElement = document.getElementById("scoreDraw");

let board = ["", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = true;

let vsAI = false;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;


/* Winning combinations */

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


/* Cell click */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = cell.dataset.index;

        if (board[index] !== "" || !gameActive) {
            return;
        }

        if (vsAI && currentPlayer === "O") {
            return;
        }

        makeMove(index, currentPlayer);

        if (!gameActive) {
            return;
        }

        if (vsAI) {

            currentPlayer = "O";

            statusText.textContent = "AI is thinking...";

            setTimeout(() => {
                aiMove();
            }, 500);

        } else {

            currentPlayer = currentPlayer === "X" ? "O" : "X";

            statusText.textContent =
                `Player ${currentPlayer}'s Turn`;
        }

    });

});


/* Make a move */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );

    checkGame();
}


/* Check game */

function checkGame() {

    let winner = null;

    let winningCombination = null;

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            winner = board[a];

            winningCombination = combination;

            break;
        }
    }


    /* Winner */

    if (winner) {

        gameActive = false;

        winningCombination.forEach(index => {
            cells[index].classList.add("winner");
        });

        if (winner === "X") {

            scoreX++;

            scoreXElement.textContent = scoreX;

        } else {

            scoreO++;

            scoreOElement.textContent = scoreO;
        }


        if (vsAI && winner === "O") {

            statusText.textContent = "AI Wins! 🤖";

        } else {

            statusText.textContent =
                `Player ${winner} Wins! 🎉`;
        }

        return;
    }


    /* Draw */

    if (!board.includes("")) {

        gameActive = false;

        scoreDraw++;

        scoreDrawElement.textContent = scoreDraw;

        statusText.textContent = "It's a Draw! 🤝";

        return;
    }
}


/* AI move */

function aiMove() {

    if (!gameActive) {
        return;
    }

    const availableCells = [];

    board.forEach((value, index) => {

        if (value === "") {
            availableCells.push(index);
        }

    });


    if (availableCells.length === 0) {
        return;
    }


    /* Try to win */

    let move = findBestMove("O");


    /* Block player */

    if (move === null) {
        move = findBestMove("X");
    }


    /* Take center */

    if (
        move === null &&
        board[4] === ""
    ) {
        move = 4;
    }


    /* Random move */

    if (move === null) {

        const randomIndex =
            Math.floor(
                Math.random() * availableCells.length
            );

        move = availableCells[randomIndex];
    }


    makeMove(move, "O");

    if (!gameActive) {
        return;
    }

    currentPlayer = "X";

    statusText.textContent = "Player X's Turn";
}


/* Find winning move */

function findBestMove(player) {

    for (let combination of winningCombinations) {

        const [a, b, c] = combination;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const playerCount =
            values.filter(value => value === player).length;

        const emptyIndex =
            combination.find(index => board[index] === "");


        if (
            playerCount === 2 &&
            emptyIndex !== undefined
        ) {

            return emptyIndex;
        }
    }

    return null;
}


/* Reset game */

function resetGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "X";

    gameActive = true;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    statusText.textContent = "Player X's Turn";
}


/* Two player mode */

twoPlayerBtn.addEventListener("click", () => {

    vsAI = false;

    twoPlayerBtn.classList.add("active");

    aiBtn.classList.remove("active");

    resetGame();

});


/* AI mode */

aiBtn.addEventListener("click", () => {

    vsAI = true;

    aiBtn.classList.add("active");

    twoPlayerBtn.classList.remove("active");

    resetGame();

});


/* New Game */

resetBtn.addEventListener("click", resetGame);