document.addEventListener('DOMContentLoaded', () => {
    const message = document.getElementById('message');

    const socket = io();

    socket.on('player-joined', (symbol) =>{
        message.innerHTML = `Your symbol is ${symbol}`;
    });


});