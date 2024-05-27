document.addEventListener('DOMContentLoaded', () => {

    const currentPlayerMessage = document.getElementById('current-player');
    const symbolMessage = document.getElementById('symbol');
    const cells = document.querySelectorAll('.cell');

    const socket = io();

    let mySymbol = '';
    let currentPlayer = 'X';
    let board = ['','','','','','','','','']
    let gameActive = true;

    socket.on('player-joined', (symbol) =>{
        mySymbol = symbol;
        symbolMessage.innerHTML = `Your symbol is ${symbol}`;
    });

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
    });

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive || mySymbol !== currentPlayer) {
            return;
        }

        socket.emit('user-made-move', { index: clickedCellIndex, symbol: mySymbol });
    }





    cells.forEach(cell => cell.addEventListener('click', handleCellClick));


});