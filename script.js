const player1 = 'X';
const player2 = 'O';
let currentToken = player1;
let cpuMode = false;
let playersTurn = true;

document.addEventListener('DOMContentLoaded', () => {
    const turnInformation = document.getElementById("sub-heading");
    const modeForm = document.getElementById('mode-selection');

    turnInformation.innerText = updatePlayerTurn(currentToken, player1);

    modeForm.addEventListener('change', (event) => {
        cpuMode = (event.target.value === "players") ? false : true;
    })

    document.getElementById("reset-button").addEventListener('click', handleReset);

    const board = document.querySelector('.gameboard-container');
    board.addEventListener('click', async (event) => {
        const updateStatus = await handleBoardClick(event);
        if (updateStatus) turnInformation.innerText = updateStatus;
    });
})

    // Old implementation (used functions have been modified)
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

async function handleBoardClick(event) {
    if (!playersTurn) {
        alert("Please wait, I'm thinking")
        return false;
    }

    const currentBoard = event.currentTarget;
    const gameElement = currentBoard.closest('.game');

    if (gameElement.classList.contains('gameover')){
        return false;
    }

    const chosenSquare = event.target.closest('.board-square');
    if (!chosenSquare) return false;

    if (chosenSquare.textContent){
        alert("Square already selected");
        return false;
    }

    chosenSquare.innerText = currentToken;

    const playerWins = getSquareGroups(currentBoard, chosenSquare);
    const winningSquaresPlayer = getWinningSquares(playerWins, currentToken);
    if (winningSquaresPlayer){
        highlightSquares(winningSquaresPlayer)
        gameElement.classList.add('gameover');
        return (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
    }

    const emptySquares = currentBoard.querySelectorAll('.board-square:empty');
    if (!emptySquares.length){
        gameElement.classList.add('gameover');
        return "Draw";
    }

    currentToken = (currentToken === player1) ? player2 : player1;

    if (cpuMode) {
        playersTurn = false;

        await pause(500);

        const cpuSquare = pickSquare(emptySquares);
        cpuSquare.innerText = currentToken;
        playersTurn = true

        const cpuWins = getSquareGroups(currentBoard, cpuSquare);
        console.log(cpuWins)
        const winningSquaresCPU = getWinningSquares(cpuWins, currentToken);
        console.log(winningSquaresCPU)
        if (winningSquaresCPU){
            highlightSquares(winningSquaresCPU)
            gameElement.classList.add('gameover');
            return (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
        }
        //Need to subtract one to account for CPU's turn. Faster than recalculating
        if (!(emptySquares.length-1)){
            gameElement.classList.add('gameover');
            return "Draw";
        }
        currentToken = (currentToken === player1) ? player2 : player1;
    }

    return updatePlayerTurn(currentToken, player1);
}

function handleReset(event) {
    const gameElement = event.target.closest('.game');
    gameElement.classList.remove('gameover');
    const gameboard = gameElement.querySelectorAll('.board-square');
    gameboard.forEach(square => {
        square.innerText = '';
        const offColor = square.classList.contains("offcolor");
        square.style.backgroundColor = offColor ? "rgb(233, 233, 233)" : "white";
    })
    gameElement.querySelector('#sub-heading').innerText = "Player 1's Turn";
}


function pickSquare(emptySquares) {
    const chosenSquare = Math.floor(Math.random() * emptySquares.length);
    return emptySquares[chosenSquare];
}

function getSquareGroups(gameboard, chosenSquare) {
    const filterList = ['row1', 'row2', 'row3', 'row4',
        'col1', 'col2', 'col3', 'col4',
        'diag1', 'diag2'
    ];
    const squareClasses = chosenSquare.className
        .split(" ")
        .filter(squareClass => {
            return filterList.includes(squareClass);
        });
    return classNodeList = squareClasses.map(group => gameboard.querySelectorAll(`.${group}`));
}

function getWinningSquares(nodeList, token) {
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

function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}




/////////////////////////////////////////////////////////////////////////

// function updateGame(chosenSquare, squares, turnInformation) {
//     return new Promise((resolve) => {
//         chosenSquare.textContent = currentToken;
//         const squareClasses = getSquareClasses(chosenSquare.className);
//         const classNodeList = squareClasses.map(group => document.querySelectorAll(`.${group}`));
//         const winningSquares = checkWin(classNodeList, currentToken);
//         if (winningSquares){
//             highlightSquares(winningSquares)
//             turnInformation.innerText = (currentToken === player1) ? "Player 1 Wins!" : "Player 2 Wins!";
//             resolve (true);
//         }
//         if (checkDraw(squares)){
//             turnInformation.innerText = "Draw";
//             resolve (true);
//         }
//         currentToken = (currentToken === player1) ? player2 : player1;
//         turnInformation.innerText = updatePlayerTurn(currentToken, player1);
//         resolve (false);
//     })
// }