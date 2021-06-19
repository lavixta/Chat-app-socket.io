//TODO 
//set server which listen to port 3000 by express
const express = require('express');
const api = express();
const {instrument} = require('@socket.io/admin-ui')
const server = api.listen(3000);
//TODO 
//set create a connection to server and set which address could be able to connect to, ex: 8080, admin.socket.io through config cors
const {Server} = require('socket.io');
const io = new Server(server,
	{
		cors:{
			origin: ['http://localhost:8080','https://admin.socket.io']
		}
	}
);
//set another namespace for another socket io
const userIo = io.of("/user")
//Io.use require an agument and trigger a next() funxtion ( continue ) if agument ( socket.handshake.auth.toke) sastify a condition otherwise it will stop
userIo.use((socket,next)=>{
	if (socket.handshake.auth.token){
		socket.username = socket.handshake.auth.token
		next()
	}else {
	next(new Error('Unauthorized Token'))
	}
})
userIo.on("connection",socket => {
	console.log("connect to user with Token" + socket.username)
})

// Create a middleware function which will trigger a funtion (next) when never an agument (socket) sastifys the condition 
io.on('connection',(socket) => {
	console.log(socket.id)
	socket.on('send-message',(message,room) => {
		if (room ===""){
			//socket broadcast mean socket send to all other sockets except itself
		socket.broadcast.emit('receive-message',message)
			}
			else {
				//socket.to(room) mean the socket only send signal to all member of the room
			socket.to(room).emit('receive-message',message)
		}
	})
	socket.on('ping',count => console.log(count))
	socket.on('join-room',room => {
		// join all socket into a room
		socket.join(room)
	})
	//
	//
});

instrument(io,{auth:false})

