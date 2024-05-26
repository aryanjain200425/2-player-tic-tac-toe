document.addEventListener('DOMContentLoaded', () => {

    const message = document.getElementById('message');
    const cells = document.querySelectorAll('.cell');

    const socket = io();

    let mySymbol = '';
    let currentPlayer = 'X';
    let board = ['','','','','','','','','']
    let gameActive = true;

    socket.on('player-joined', (symbol) =>{
        mySymbol = symbol;
        message.innerHTML = `Your symbol is ${symbol}`;
    });

    socket.on('update-game', (info) =>{
        console.log("UPDATING IFNORMALK");
        cells[info.index].textContent = info.symbol;
    });

    function handleCellClick(event) {
        console.log("CLICKED");
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (board[clickedCellIndex] !== '' || !gameActive || mySymbol !== currentPlayer) {
            console.log("HIIIHIHIH");
            return;
        }

        socket.emit('user-made-move', { index: clickedCellIndex, symbol: mySymbol });
    }





    cells.forEach(cell => cell.addEventListener('click', handleCellClick));


});