const player1 = 'X';
const player2 = 'O';
let currentToken = player1;
let cpuMode = false;
let gameOver = false;

document.addEventListener('DOMContentLoaded', () => {
    const turnInformation = document.getElementById("sub-heading");
    var body = document.querySelector('body');
    var resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.id = 'reset-button';
    var modeForm = document.getElementById('mode-selection');

    turnInformation.innerText = updatePlayerTurn(currentToken, player1);

    modeForm.addEventListener('change', (event) => {
        cpuMode = (event.target.value === "players") ? false : true;
    })

    // squares.forEach(square => {
    //     square.addEventListener('click', async function() {
    //         if (gameOver){
    //             return;
    //         }
    //         let chosenSquare = square;
    //         if (chosenSquare.textContent){
    //             alert("Square already selected");
    //             return;
    //         }
    //         gameOver = await updateGame(chosenSquare, squares, turnInformation);
    //         console.log(`1 ${gameOver}`)
    //         if (cpuMode && !gameOver) {
    //             chosenSquare = await pickSquare(squares);
    //             gameOver = await updateGame(chosenSquare, squares, turnInformation)
    //         }
    //         console.log(`2 ${gameOver}`)
    //         if (gameOver) {
    //             body.appendChild(resetButton);
    //             resetButton.addEventListener('click', () => {
    //                 resetBoard(squares);
    //                 currentToken = player1;
    //                 turnInformation.innerText = updatePlayerTurn(currentToken, player1);
    //                 resetButton.remove();
    //                 gameOver = false;
    //             })
    //             return;
    //         }

    //     })
    // })
    const board = document.querySelector('.gameboard-container');
    board.addEventListener('click', async (event) => {
        const updateStatus = await handleBoardClick(event);
        if (updateStatus) turnInformation.innerText = updateStatus;
    });
})

async function handleBoardClick(event) {
    if (gameOver){
        return false;
    }

    const currentBoard = event.currentTarget;

    const chosenSquare = event.target.closest('.board-square');
    if (!chosenSquare) return false;

    if (chosenSquare.textContent){
        alert("Square already selected");
        return false;
    }

    chosenSquare.innerText = currentToken;

    const playerWins = getWinningSquares(currentBoard, chosenSquare);
    const winningSquaresPlayer = checkWin(playerWins, currentToken);
    if (winningSquaresPlayer){
        highlightSquares(winningSquaresPlayer)
        gameOver = true;
        return (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
    }

    const emptySquares = currentBoard.querySelectorAll('.board-square:empty');
    if (!emptySquares.length){
        gameOver = true;
        return "Draw";
    }

    currentToken = (currentToken === player1) ? player2 : player1;

    if (cpuMode && !gameOver) {
        const cpuSquare = await pickSquare(emptySquares);
        cpuSquare.innerText = currentToken;
        const cpuWins = getWinningSquares(currentBoard, chosenSquare);
        const winningSquaresCPU = checkWin(cpuWins, currentToken);
        if (winningSquaresCPU){
            highlightSquares(winningSquaresCPU)
            gameOver = true;
            return (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
        }
        if (!emptySquares.length){
            gameOver = true;
            return "Draw";
        }
        currentToken = (currentToken === player1) ? player2 : player1;
    }

    return updatePlayerTurn(currentToken, player1);
}

function pickSquare(emptySquares) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const chosenSquare = Math.floor(Math.random() * emptySquares.length);
            resolve (emptySquares[chosenSquare]);
        }, 500)
    })
}

function getWinningSquares(gameboard, chosenSquare) {
    const squareClasses = chosenSquare.className
        .split(" ")
        .filter(squareClass => {
            filterList = ['row1', 'row2', 'row3', 'row4',
                'col1', 'col2', 'col3', 'col4',
                'diag1', 'diag2'
            ];
            return filterList.includes(squareClass);
        });
    return classNodeList = squareClasses.map(group => gameboard.querySelectorAll(`.${group}`));
}

function checkWin(nodeList, token) {
    for (let node of nodeList) {
        const allMatch = Array.from(node)
        .every(square => (square.textContent === token) ? true : false);
        if (allMatch){
            return node;
        }
    }
    return false;
}

function highlightSquares(squares) {
    squares.forEach(square => {
        square.style.backgroundColor = 'gold';
    })
}

function updatePlayerTurn(currentToken, player1){
    return (currentToken === player1)
    ? `Player 1's Turn`
    : `Player 2's Turn`;
}








/////////////////////////////////////////////////////////////////////////

function resetBoard(squares) {
    squares.forEach(square => {
        square.innerText = '';
        const offColor = square.classList.contains("offcolor");
        square.style.backgroundColor = offColor ? "rgb(233, 233, 233)" : "white";
    })
}

function updateGame(chosenSquare, squares, turnInformation) {
    return new Promise((resolve) => {
        chosenSquare.textContent = currentToken;
        const squareClasses = getSquareClasses(chosenSquare.className);
        const classNodeList = squareClasses.map(group => document.querySelectorAll(`.${group}`));
        const winningSquares = checkWin(classNodeList, currentToken);
        if (winningSquares){
            highlightSquares(winningSquares)
            turnInformation.innerText = (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
            resolve (true);
        }
        if (checkDraw(squares)){
            turnInformation.innerText = "Draw";
            resolve (true);
        }
        currentToken = (currentToken === player1) ? player2 : player1;
        turnInformation.innerText = updatePlayerTurn(currentToken, player1);
        resolve (false);
    })
}



// Wait for click

// Confirm Space Open

// Check for Win

// Computer Plays

// Check for Win

// Repeat