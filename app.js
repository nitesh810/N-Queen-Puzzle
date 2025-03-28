// DOM elements
const numberbox = document.getElementById("numberbox");
const slider = document.getElementById("slider");
const progressBar = document.getElementById("progress-bar");
const playButton = document.getElementById('play-button');

// HTML code to represent a queen piece
const queen = '<i class="fas fa-chess-queen" style="color:#000"></i>';

let n, speed, tempSpeed, q, Board = 0;  // Initialize variables

// Array storing the number of possible arrangements for N-Queens
let array = [0, 2, 1, 1, 3, 11, 5, 41, 93];

// Object to keep track of board states during the solving process, queen position
let pos = {};

// Update the speed of visualization based on the slider's value
speed = (100 - slider.value) * 10;
tempSpeed = speed;
slider.oninput = function () {
    progressBar.style.width = this.value + "%";
    speed = slider.value;
    speed = (100 - speed) * 10;
}

// Class representing the Queen and its solving methods
class Queen {
    constructor() {
        this.position = { ...pos };  // Clone the current position of queen
        this.uuid = [];  // Array to store unique IDs for boards
    }

    // Method to initiate the solving of the N-Queen problem
    nQueen = async () => {
        Board = 0;
        this.position[`${Board}`] = {};
        numberbox.disabled = true;
        await q.solveQueen(Board, 0, n);
        await q.clearColor(Board);
        numberbox.disabled = false;
    }

    // Method to check if placing a queen is valid at a given row and column
    isValid = async (board, r, col, n) => {
        const table = document.getElementById(`table-${this.uuid[board]}`);
        const currentRow = table.firstChild.childNodes[r];
        const currentColumn = currentRow.getElementsByTagName("td")[col];
        currentColumn.innerHTML = queen;
        await q.delay();

        // Check the same column above the current position
        for (let i = r - 1; i >= 0; --i) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[col];

            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // Check the upper left diagonal
        for (let i = r - 1, j = col - 1; i >= 0 && j >= 0; --i, --j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];

            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#fb5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }

        // Check the upper right diagonal
        for (let i = r - 1, j = col + 1; i >= 0 && j < n; --i, ++j) {
            const row = table.firstChild.childNodes[i];
            const column = row.getElementsByTagName("td")[j];

            if (column.innerHTML == queen) {
                column.style.backgroundColor = "#FB5607";
                currentColumn.innerHTML = "-";
                return false;
            }
            column.style.backgroundColor = "#ffca3a";
            await q.delay();
        }
        return true;
    }

    // Method to reset the color of the board to the default
    clearColor = async (board) => {
        for (let j = 0; j < n; ++j) {
            const table = document.getElementById(`table-${this.uuid[board]}`);
            const row = table.firstChild.childNodes[j];
            for (let k = 0; k < n; ++k)
                (j + k) & 1
                    ? (row.getElementsByTagName("td")[k].style.backgroundColor = "#FF9F1C")
                    : (row.getElementsByTagName("td")[k].style.backgroundColor = "#FCCD90");
        }
    }

    // Method to introduce a delay in the visualization
    delay = async () => {
        await new Promise((done) => setTimeout(() => done(), speed));
    }

    // Recursive method to solve the N-Queen problem
    solveQueen = async (board, r, n) => {
        if (r == n) {
            ++Board;
            let table = document.getElementById(`table-${this.uuid[Board]}`);
            for (let k = 0; k < n; ++k) {
                let row = table.firstChild.childNodes[k];
                row.getElementsByTagName("td")[this.position[board][k]].innerHTML = queen;
            }
            this.position[Board] = this.position[board];
            return;
        }

        for (let i = 0; i < n; ++i) {
            await q.delay();
            await q.clearColor(board);
            if (await q.isValid(board, r, i, n)) {
                await q.delay();
                await q.clearColor(board);
                let table = document.getElementById(`table-${this.uuid[board]}`);
                let row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = queen;

                this.position[board][r] = i;

                if (await q.solveQueen(board, r + 1, n))
                    await q.clearColor(board);

                await q.delay();
                board = Board;
                table = document.getElementById(`table-${this.uuid[board]}`);
                row = table.firstChild.childNodes[r];
                row.getElementsByTagName("td")[i].innerHTML = "-";

                delete this.position[`${board}`][`${r}`];
            }
        }
    }
}

// Event listener for the play button to start the visualization
playButton.onclick = async function visualise() {
    const chessBoard = document.getElementById("n-queen-board");
    const arrangement = document.getElementById("queen-arrangement");

    n = numberbox.value;
    q = new Queen();

    if (n > 8) {
        numberbox.value = "";
        alert("Queen value is too large");
        return;
    } else if (n < 1) {
        numberbox.value = "";
        alert("Queen value is too small");
        return;
    }

    // Clear the previous boards and arrangements
    while (chessBoard.hasChildNodes()) {
        chessBoard.removeChild(chessBoard.firstChild);
    }

    const para = document.createElement("p");
    para.setAttribute("class", "queen-info");
    para.innerHTML = `For ${n}x${n} board, ${array[n] - 1} arrangements are possible.`;
    arrangement.appendChild(para);

    // Create the boards in the UI
    if (chessBoard.childElementCount === 0) {
        for (let i = 0; i < array[n]; ++i) {
            q.uuid.push(Math.random());
            let div = document.createElement('div');
            let table = document.createElement('table');
            let header = document.createElement('h4');
            header.innerHTML = `Board ${i + 1} `;
            table.setAttribute("id", `table-${q.uuid[i]}`);
            header.setAttribute("id", `paragraph-${i}`);
            chessBoard.appendChild(div);
            div.appendChild(header);
            div.appendChild(table);
        }
    }

    // Initialize the boards with cells and colors
    for (let k = 0; k < array[n]; ++k) {
        let table = document.getElementById(`table-${q.uuid[k]}`);
        for (let i = 0; i < n; ++i) {
            const row = table.insertRow(i);
            row.setAttribute("id", `Row${i} `);
            for (let j = 0; j < n; ++j) {
                const col = row.insertCell(j);
                (i + j) & 1
                    ? (col.style.backgroundColor = "#FF9F1C")
                    : (col.style.backgroundColor = "#FCCD90");
                col.innerHTML = "-";
                col.style.border = "0.3px solid #373f51";
            }
        }
        await q.clearColor(k);
    }
    await q.nQueen();
};
