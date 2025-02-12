const player1 = 'X';
const player2 = 'O';
let currentToken = player1;
let cpuMode = true;

document.addEventListener('DOMContentLoaded', () => {
    const turnInformation = document.getElementById("sub-heading");
    const squares = document.querySelectorAll(".board-square");

    turnInformation.innerText = updatePlayerTurn(currentToken, player1);

    squares.forEach(square => {
        square.addEventListener('click', () => {
            let chosenSquare = square;
            if (chosenSquare.textContent){
                alert("Square already selected");
                return;
            }
            updateGame(chosenSquare, squares, turnInformation);
            if (currentToken === player2 && cpuMode) {
                chosenSquare = pickSquare(squares);
                setTimeout(() => updateGame(chosenSquare, squares, turnInformation), 500)
            }

        })
    })
})


function pickSquare(squares) {
    const openSquareList = Array.from(squares)
        .filter(square => !square.textContent)
    const chosenSquare = Math.floor(Math.random() * openSquareList.length);
    return openSquareList[chosenSquare]
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
    chosenSquare.textContent = currentToken;
    const squareClasses = getSquareClasses(chosenSquare.className);
    const classNodeList = squareClasses.map(group => document.querySelectorAll(`.${group}`));
    const winningSquares = checkWin(classNodeList, currentToken);
    if (winningSquares){
        highlightSquares(winningSquares)
        alert("You win");
        return
    }
    checkDraw(squares) && alert("Draw");
    currentToken = (currentToken === player1) ? player2 : player1;
    turnInformation.innerText = updatePlayerTurn(currentToken, player1);
}



// Wait for click

// Confirm Space Open

// Check for Win

// Computer Plays

// Check for Win

// Repeat