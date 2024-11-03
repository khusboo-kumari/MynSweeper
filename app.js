function startGame() {
    const td = document.querySelector(".td");
    const board = document.querySelector("#board");
    const levels = document.querySelector("#levels");
    let flagCount = document.querySelector(".flagCount");
    const closeBtn = document.querySelector(".close-btn");
    const startBtn = document.querySelector(".start-btn");
    const cheatMode = document.querySelector(".cheat-mode-btn");
    const playground = document.querySelector(".playground");
    const cheatToggle = document.querySelector(".cheatToggle");
    const homeContainer = document.querySelector(".home-container");
    const mainContainer = document.querySelector(".main-container");

    let revealedCellsCount = 0;
    let level = "easy";
    let boardSize = 10;
    let mineCount = 5;
    let flagsCount = mineCount;
    let mines = [];
    let gameOver = false;

    // update grid with difficultu level changes
    levels.addEventListener("change", (event) => {
        level = event.target.value;
        boardSize = levelMapper[level].boardSize;
        mineCount = levelMapper[level].mineCount;
        flagsCount = mineCount;

        //  Clear the board and reset the game
        boardArr = [];
        mines = [];
        gameOver = false;
        flagCount.innerText = flagsCount;

        generateGrid(boardSize);
        addMine();
    });

    let boardArr = []; // Additional State Variable for the Board Array

    // Start and Close button Event Listeners
    startBtn.addEventListener("click", function () {
        mainContainer.style.display = "flex";
        homeContainer.style.display = "none";
        console.log("Start the gameeeee ");
    });
    closeBtn.addEventListener("click", function () {
        mainContainer.style.display = "none";
        homeContainer.style.display = "flex";
        console.log("Close the gameeeee ");
        location.reload(); // is used to refresh the current webpage .
    });

    // CheatMode Event Listener
    cheatMode.addEventListener("click", (e) => {

        if (e.target.innerText === "Off") {
            cheatToggle.innerText = "On";
            revealAllCells();
        } else {
            cheatToggle.innerText = "Off";
            hideAllCells();
        }
    });

    //  The variable id is a string formed by combining the row and column indices (e.g., "2-3" for row 2, column 3).
    // This id matches the format used to store mine locations in the mines array, which helps in identifying whether a cell contains a mine.
    function revealAllCells() {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const cell = boardArr[r][c];
                if (!cell.classList.contains("revealed")) {
                    const id = `${r}-${c}`;
                    if (mines.includes(id)) {
                        cell.innerText = "💣";
                    } else {
                        const adjacentMines = countAdjacentMines(r, c);
                        cell.innerText = adjacentMines > 0 ? adjacentMines : "";
                    }
                    cell.classList.add("cheat-revealed");
                }
            }
        }
    }

    function hideAllCells() {
        for (let r = 0; r < boardSize; r++) {
            for (let c = 0; c < boardSize; c++) {
                const cell = boardArr[r][c];
                if (cell.classList.contains("cheat-revealed")) {
                    cell.innerText = "";
                    cell.classList.remove("cheat-revealed");
                }
            }
        }
    }


    function countAdjacentMines(r, c) {
        let count = 0;
        for (let i = r - 1; i <= r + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i < 0 || j < 0 || i >= boardSize || j >= boardSize) continue;
                if (mines.includes(`${i}-${j}`)) count++;
            }
        }
        return count;
    }
    // Generate the grid of size boardSize 
    function generateGrid(size) {
        playground.innerHTML = "";  // clear the existing grid 
        const table = document.createElement("table");
        for (let i = 0; i < size; i++) {
            const row = document.createElement("tr");
            let rowArr = [];
            for (let j = 0; j < size; j++) {
                const cell = document.createElement("td");
                cell.id = i + "-" + j;
                // Set dynamic cell dimensions based on grid size 
                cell.style.width = `calc(100% / ${size})`;
                cell.style.height = `calc(100% / ${size})`;
                cell.addEventListener("click", revealBox);
                cell.addEventListener("contextmenu", flagBox);
                row.appendChild(cell);
                rowArr.push(cell);
            }
            table.appendChild(row);
            boardArr.push(rowArr);
        }
        playground.appendChild(table);
        addMine();
    }

    // Add Mine to the board 
    function addMine() {
        while (mines.length < mineCount) {
            const r = Math.floor(Math.random() * boardSize);
            const c = Math.floor(Math.random() * boardSize);
            let id = r + "-" + c;
            if (!mines.includes(id)) {
                mines.push(id);
            }
        }
        console.log(mines);
    }

    // Reveal the cell and check if it is a mine or not 

    function revealBox(e) {
        const box = e.currentTarget;
        const values = e.currentTarget.id.split("-");
        const r = parseInt(values[0]);
        const c = parseInt(values[1]);

        if (box.classList.contains("flag")) {
            return;
        }
        if (box.classList.contains("revealed")) {
            console.log("Box already revealed");
            box.removeEventListener("click", revealBox);
            return;
        }
        checkMine(box);
        revealCount(r, c);
    }

    function flagBox(e) {
        e.preventDefault();
        const box = e.currentTarget;
        if (box.classList.contains("revealed")) {
            return;
        }
        if (box.classList.contains("flag")) {
            box.classList.remove("flag");
            box.innerText = "";
            flagsCount++;
            flagCount.innerText = flagsCount;
        } else {
            box.classList.add("flag");
            box.innerText = "🚩";
            flagsCount--;
            flagCount.innerText = flagsCount;
        }
    }

    // Check if the cell contains a mine or not 
    function checkMine(box) {
        console.log(box);
        if (mines.includes(box.id)) {
            gameOver = true;
            revealAllCells();
            // gameOver();
            GameOver();
        }
    }

    function revealCount(r, c) {
        if (r < 0 || c < 0 || r >= boardSize || c >= boardSize || gameOver || boardArr[r][c].classList.contains("revealed")) {
            return;
        }
        boardArr[r][c].classList.add("revealed");
        revealedCellsCount++;

        let cnt = countAdjacentMines(r, c);

        //  Trigger shale animation if the count is zero 
        if (cnt === 0) {
            const table = document.querySelector(".playground table");
            table.classList.add("shake");

            setTimeout(() => {
                table.classList.remove("shake");
            }, 500);

        }

        if (cnt > 0) {
            boardArr[r][c].innerText = cnt;
        } else {
            for (let i = r - 1; i <= r + 1; i++) {
                for (let j = c - 1; j <= c + 1; j++) {
                    if (i < 0 || j < 0 || i >= boardSize || j >= boardSize) continue;
                    revealCount(i, j);
                }
            }
        }

        if (revealedCellsCount === boardSize * boardSize - mineCount) {
            gameOver = true;
            revealAllCells();
            YouWon();
        }
        if (!mines.includes(`${r}-${c}`)) revealedCellsCount++;

    }


    /*   
    Win Condition Check:

javascript
Copy code
if (revealCnt === boardSize * boardSize - mineCount) {
    gameOver = true;
    revealAllCells();
    YouWon();
}
Checks if the number of revealed cells (revealCnt) matches the number of safe cells on the board (total cells minus mines).
    */


    function GameOver() {
        console.log("You Lost ");
        const div = document.createElement("div");
        div.className = "loser-screen";

        const loserText = document.createElement("h2");
        loserText.innerText = "----🐧GAME OVER🐧----";

        const playAgain = document.createElement("div");
        playAgain.className = "playAgain";

        const p = document.createElement("p");
        p.innerText = "Do you want to play again? ";

        const restart = document.createElement("img");
        // restart.src = "assets/restart.svg";
        restart.src = "https://www.shutterstock.com/shutterstock/photos/1463139755/display_1500/stock-vector-undo-icon-back-or-return-illustration-as-a-simple-vector-sign-trendy-symbol-for-design-1463139755.jpg";
        restart.alt = "Restart";
        restart.className = "restart";

        playAgain.append(p, restart);

        playAgain.addEventListener("click", function () {
            location.reload();
        });

        div.append(loserText, playAgain);
        playground.append(div);


    }


    function YouWon() {
        console.log("You won");
        const div = document.createElement("div");
        div.className = "winner-screen"

        const winnerText = document.createElement("h2")
        winnerText.innerText = "---- 🎊 YOU WON 🎊 ----"
        const playAgain = document.createElement("div");
        playAgain.className = "playAgain";
        const p = document.createElement("p");
        p.innerText = "Play Again";
        const restart = document.createElement("img")
        // restart.src = "assests/restart.svg";
        restart.src = "https://www.shutterstock.com/shutterstock/photos/1463139755/display_1500/stock-vector-undo-icon-back-or-return-illustration-as-a-simple-vector-sign-trendy-symbol-for-design-1463139755.jpg";

        restart.className = "restart";
        playAgain.append(p, restart);

        playAgain.addEventListener("click", () => {
            location.reload();
        })

        div.append(winnerText, playAgain);
        playground.append(div);
    }

    generateGrid(boardSize)
    addMine();
}

document.addEventListener("DOMContentLoaded", startGame);




const levelMapper = {
    easy: {
        boardSize: 10,
        mineCount: 10
    },
    medium: {
        boardSize: 16,
        mineCount: 12
    },
    hard: {
        boardSize: 20,
        mineCount: 25
    }
}





