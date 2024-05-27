const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

server.listen(port, () => console.log(`Server is running on port ${port}`));

let players = new Array();

io.on('connection', (socket) => {

    // when a player joins
    console.log('A user connected:', socket.id);

    players.push(socket.id)

    if(players.length === 1){
        socket.emit('player-joined', 'X');
    }
    else if(players.length == 2){
        socket.emit('player-joined', 'O');
    }
    else{
        socket.emit('player-joined', 'Spectating');
    }

    socket.on('user-made-move', (info)=>{
        io.emit('update-game', info);
    });

    socket.on('reset-game-pressed', () =>{
        io.emit('reset-game');
    })
    

    // when a player leaves
    socket.on('disconnect', () =>{
        console.log('A user disconnected: ', socket.id);
        players.splice(players.indexOf(socket.id), 1);

    });


});

