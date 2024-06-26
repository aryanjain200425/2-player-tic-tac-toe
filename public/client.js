document.addEventListener('DOMContentLoaded', () => {

    const currentPlayerMessage = document.getElementById('current-player');
    const symbolMessage = document.getElementById('symbol');
    const resetButton = document.getElementById('reset');
    const cells = document.querySelectorAll('.cell');

    const socket = io();

    let mySymbol = '';
    let currentPlayer = 'X';
    let board = ['','','','','','','','','']
    let gameActive = false;


    function settingPlayer(symbol, numPlayers){
        mySymbol = symbol;
        symbolMessage.innerHTML = `Your symbol is ${symbol}`;
        if(numPlayers === 1){
            currentPlayerMessage.textContent = 'Waiting for opponent...';
        }
        else if (numPlayers >= 2) {
            socket.emit("start-the-game");
        }
    }
    socket.on('player-joined', (symbol, numPlayers) =>{
        settingPlayer( symbol, numPlayers);
    });

    socket.on('player-left',(symbol, numPlayers) =>{
        resetGame();
        settingPlayer(symbol, numPlayers);
    });


    socket.on("starting-game", () =>{
        currentPlayerMessage.textContent = `Current player is ${currentPlayer}`;
        gameActive = true;
    })

    socket.on('update-game', (info) =>{
        if (currentPlayer ==="X"){
            currentPlayer = "O";
        }
        else{
            currentPlayer = "X";
        }

        currentPlayerMessage.textContent = `Current player is ${currentPlayer}`
        cells[info.index].textContent = info.symbol;
        board[info.index] = info.symbol;

        checkGameOver();
    });


    socket.on('reset-game', (numPlayer) => {
        board = ['','','','','','','','',''];
        cells.forEach(cell => cell.textContent='');
        
        currentPlayer = 'X';
        if(numPlayer >=2 ){
            gameActive = true;
            currentPlayerMessage.textContent = `Current player is ${currentPlayer}`;
        }
        else{
            gameActive = false;
            currentPlayerMessage.textContent = `waiting for opponenet...`;
        }
        
    });

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive || mySymbol !== currentPlayer) {
            return;
        }

        socket.emit('user-made-move', { index: clickedCellIndex, symbol: mySymbol });
    }

    function resetGame(){
        socket.emit('reset-game-pressed');
    };





    function checkGameOver(){
        console.log("CHEKiNG IF WINNrf");
        const winningConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        winningConditions.forEach(element => {
            let first = board[element[0]];
            let second = board[element[1]];
            let third = board[element[2]];

            if((first === second && first === third) && first !== '' && second !== '' && third !== ''){
                gameActive = false;
                currentPlayerMessage.textContent = `The winner is ${first}`;
            }
            
        });
    }



    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);

});