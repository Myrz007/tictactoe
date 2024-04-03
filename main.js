const player = (marker) => {
    let name = `Player ${marker}`;
    let score = 0;

    const increaseScore = () => score++;
    const getScore = () => `${score}`;
    const resetScore = () => score = 0;

    return {
        marker,
        name,
        increaseScore,
        getScore,
        resetScore,
    };
};

const game = (() => {
    const playerOneName = document.querySelector('#playerone-name');
    const playerOneScore = document.querySelector('#playerone-score');
    const playerTwoName = document.querySelector('#playertwo-name');
    const playerTwoScore = document.querySelector('#playertwo-score');
    const turn = document.querySelector('#turn');
    const restart = document.querySelector('#restart');
    const edit = document.querySelector('#edit');
    const cells = document.querySelectorAll('.cell');
    const playerDialog = document.querySelector('#playerdialog');
    const form = document.querySelector('form');
    const winDialog = document.querySelector('#windialog');
    const playerXName = document.querySelector('#playerx-name');
    const playerOName = document.querySelector('#playero-name');
    const submit = document.querySelector('input[type=submit]');
    const cancel = document.querySelector('input[type=button]');
    const winner = document.querySelector('#winner');
    const replay = document.querySelector('#replay');
    const reset = document.querySelectorAll('.reset');

    const playerX = player('X');
    const playerO = player('O');

    let playedTurns = 0;
    let playerOTurn = false;

    const definePlayer = () => playerOTurn ? playerO : playerX;

    const defineMarker = () => definePlayer().marker;

    const sayPlayerTurn = () => turn.innerText = `${definePlayer().name}'s turn`;

    sayPlayerTurn();

    const displayNames = () => {
        playerOneName.innerText = playerX.name;
        playerTwoName.innerText = playerO.name;
    };

    displayNames();

    const displayScores = () => {
        playerOneScore.innerText = playerX.getScore();
        playerTwoScore.innerText = playerO.getScore();
    };

    displayScores();

    const editPlayerNames = () => {
        if (playerXName.value !== '') playerX.name = playerXName.value;
        if (playerOName.value !== '') playerO.name = playerOName.value;
    };

    const cancelNameInputs = () => {
        playerXName.value = '';
        playerOName.value = '';
    };

    const openDialog = (screen) => screen.showModal(); 

    const closeDialog = (screen) => screen.close();

    const checkCombination = (...indexes) => {
        const comboPattern = `${cells[indexes[0]].innerText}${cells[indexes[1]].innerText}${cells[indexes[2]].innerText}`;

        return comboPattern === 'XXX' || comboPattern === 'OOO';
    };

    const checkRows = () => checkCombination(0, 1, 2) || checkCombination(3, 4, 5) || checkCombination(6, 7, 8);

    const checkColumns = () => checkCombination(0, 3, 6) || checkCombination(1, 4, 7) || checkCombination(2, 5, 8);

    const checkDiagonals = () => checkCombination(0, 4, 8) || checkCombination(2, 4, 6);

    const declareWinner = () => winner.textContent = `${definePlayer().name} wins!!!`;

    const playTurn = (cell) => {
        if (cell.innerText === '') {
            cell.innerText = defineMarker();
            playedTurns++;
            if (checkColumns() && playedTurns <= 9 || checkDiagonals() && playedTurns <= 9 || checkRows() && playedTurns <= 9) {
                openDialog(winDialog);
                declareWinner();
                definePlayer().increaseScore();
                displayScores();
            }
            else if (!checkColumns() && playedTurns === 9 || !checkDiagonals() && playedTurns === 9 || !checkRows() && playedTurns === 9) {
                openDialog(winDialog);
                winner.textContent = 'It is a tie!';
            }
            playerOTurn = !playerOTurn;
            sayPlayerTurn();
        }
        else return;
    };

    const eraseCells = () => cells.forEach((cell) => cell.innerText = '');

    const resetPlayedTurns = () => playedTurns = 0;

    const resetGame = () => {
        playerX.name = 'Player X';
        playerO.name = 'Player O';
        playerX.resetScore();
        playerO.resetScore();
    };

    restart.addEventListener('click', () => eraseCells());

    edit.addEventListener('click', () => openDialog(playerDialog));

    submit.addEventListener('click', () => {
        editPlayerNames();
        cancelNameInputs();
        displayNames();
        closeDialog(playerDialog);
        sayPlayerTurn();
    });

    cancel.addEventListener('click', () => {
        cancelNameInputs();
        closeDialog(playerDialog);
    });

    cells.forEach((cell) => cell.addEventListener('click', () => playTurn(cell)));

    replay.addEventListener('click', () => {
        resetPlayedTurns();
        eraseCells();
        closeDialog(winDialog);
        sayPlayerTurn();
    });

    reset.forEach((button) => button.addEventListener('click', () => {
        resetGame();
        displayNames();
        displayScores();
        eraseCells();
        resetPlayedTurns();
        if(winDialog.open) closeDialog(winDialog);
        sayPlayerTurn();
    }));
})();
