const joinRoomButton = document.getElementById("room-button");
//install socket.io-client and import it as io
import {io} from 'socket.io-client'
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io('http://localhost:3000')
//use namespace socket (/user) for nagigation
//And pass to it a Token 'Test'
const userSocket = io('http://localhost:3000/user',{auth:{token:'Test'}})
//socket.on mean socket is connected to server and the message following ('connect') is the message pass around sever and clients
socket.on('connect',() => {
	displayMessage('you connected')
})
socket.on('receive-message',message => {
	displayMessage(message)
})
//Show connect error
userSocket.on('connect_error',error => {
	displayMessage(error)
})
console.log(socket.username)
// userSocket.on('connect',()=>{
// 	displayMessage('connect to userSocket')
// })
form.addEventListener("submit", e => {
    e.preventDefault();
    const message = messageInput.value;
    const room = roomInput.value;
    console.log(messageInput);
    if (message === "") return;

    displayMessage(message);
    //socket.emit mean socket emit and message and its variable to server 
    socket.emit('send-message',message,room)
    messageInput.value = "";
});

joinRoomButton.addEventListener("click", () => {
    const room = roomInput.value;
    socket.emit('join-room',room)
})

function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("message-container").append(div);
}
let count = 0
setInterval(()=>{
	//volatile mean socket will not buffer until the connection is created again 
	socket.volatile.emit('ping',++count)
	// socket.emit('ping',++count)
},1000)
// connect and disconnect socket
document.addEventListener('keydown',e =>{
	if (e.key === 'c') {
		socket.connect()
	}
	if (e.key ==='d'){
		socket.disconnect()
	}
})
