const player1 = 'X';
const player2 = 'O';
let currentToken = player1;
let cpuMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const turnInformation = document.getElementById("sub-heading");
    const squares = document.querySelectorAll(".board-square");
    const body = document.querySelector('body');
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.id = 'reset-button';
    const modeForm = document.getElementById('mode-selection');
    let gameOver = false;

    turnInformation.innerText = updatePlayerTurn(currentToken, player1);

    modeForm.addEventListener('change', (event) => {
        cpuMode = (event.target.value === "players") ? false : true;
    })

    squares.forEach(square => {
        square.addEventListener('click', async function() {
            if (gameOver){
                return;
            }
            let chosenSquare = square;
            if (chosenSquare.textContent){
                alert("Square already selected");
                return;
            }
            gameOver = await updateGame(chosenSquare, squares, turnInformation);
            console.log(`1 ${gameOver}`)
            if (cpuMode && !gameOver) {
                chosenSquare = await pickSquare(squares);
                gameOver = await updateGame(chosenSquare, squares, turnInformation)
            }
            console.log(`2 ${gameOver}`)
            if (gameOver) {
                body.appendChild(resetButton);
                resetButton.addEventListener('click', () => {
                    resetBoard(squares);
                    currentToken = player1;
                    turnInformation.innerText = updatePlayerTurn(currentToken, player1);
                    resetButton.remove();
                    gameOver = false;
                })
                return;
            }

        })
    })
})

function resetBoard(squares) {
    squares.forEach(square => {
        square.innerText = '';
        const offColor = square.classList.contains("offcolor");
        square.style.backgroundColor = offColor ? "rgb(233, 233, 233)" : "white";
    })
}

function pickSquare(squares) {
    return new Promise((resolve) => {
        const openSquareList = Array.from(squares)
            .filter(square => !square.textContent);
        setTimeout(() => {
            const chosenSquare = Math.floor(Math.random() * openSquareList.length);
            resolve (openSquareList[chosenSquare]);
        }, 500)
    })
}

function getSquareClasses(classes) {
    return classes
        .replace("board-square", "")
        .replace("offcolor", "")
        .trim()
        .split(" ");
}

function updatePlayerTurn(currentToken, player1){
    return (currentToken === player1)
    ? `Player 1's Turn`
    : `Player 2's Turn`;
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

function checkDraw(allSquares) {
    const allFilled = Array.from(allSquares)
        .every(square => (square.textContent !== '')) ? true : false;
    return allFilled
}


function highlightSquares(squares) {
    squares.forEach(square => {
        square.style.backgroundColor = 'gold';
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