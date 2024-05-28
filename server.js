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
        socket.emit('player-joined', 'X', 1);
    }
    else if(players.length == 2){
        socket.emit('player-joined', 'O', 2);
    }
    else{
        socket.emit('player-joined', 'Spectating');
    }

    socket.on('user-made-move', (info)=>{
        io.emit('update-game', info);
    });

    socket.on('reset-game-pressed', () =>{
        io.emit('reset-game', players.length);
    })

    socket.on('start-the-game', ()=> {
        io.emit('starting-game');
    })
    

    // when a player leaves
    socket.on('disconnect', () =>{
        console.log('A user disconnected: ', socket.id);

        let index = players.indexOf(socket.id);

        players.splice(index, 1);

        //Player X leaves
        if (index === 0){
            io.to(players[0]).emit('player-left', 'X', players.length);
            if(players.length >= 2){
                io.to(players[1]).emit('player-left', 'O', players.length);
            }
        }
        //Player O leaves
        if (index === 1){
            if(players.length >= 2){
                io.to(players[1]).emit('player-left', 'O', players.length);
            }
            else{
                io.to(players[0]).emit('player-left', 'X', players.length);
            }
            
        }

    });


});

