const player1 = 'X';
const player2 = 'O';
let currentToken = player1;

document.addEventListener('DOMContentLoaded', () => {
    const turnInformation = document.getElementById("sub-heading");
    const squares = document.querySelectorAll(".board-square");

    turnInformation.innerText = updatePlayerTurn(currentToken, player1);

    squares.forEach(square => {
        square.addEventListener('click', () => {

            if (!square.textContent) {
                square.textContent = currentToken;
                const squareGroups = square.className
                    .replace("board-square", "")
                    .replace("offcolor", "")
                    .trim()
                    .split(" ");
                const winningGroup = checkWin(squareGroups, currentToken)
                if (winningGroup){
                    winningGroup.forEach(square => {
                        square.style.backgroundColor = 'gold';
                    })
                    alert("You win");
                }
                const drawCheck = checkDraw(squares)
                currentToken = (currentToken === player1) ? player2 : player1;
                turnInformation.innerText = updatePlayerTurn(currentToken, player1);
            } else {
                alert("Square already selected.");
            }
        })
    })
})

function updatePlayerTurn(currentToken, player1){
    return (currentToken === player1)
    ? `Player 1's Turn`
    : `Player 2's Turn`;
}

function checkWin(squareGroups, token) {
    for (let group of squareGroups) {
        const inARow = document.querySelectorAll(`.${group}`);
        const allMatch = Array.from(inARow)
            .every(square => (square.textContent === token) ? true : false);
        if (allMatch){
            return inARow;
        }
    }
    return false;
}

function checkDraw(allSquares) {
    const allFilled = Array.from(allSquares)
        .every(square => (square.textContent !== '')) ? true : false;
    return allFilled
}



// Wait for click

// Confirm Space Open

// Check for Win

// Computer Plays

// Check for Win

// Repeat