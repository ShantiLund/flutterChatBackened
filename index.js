var express = require('express');
var app = express();
require('dotenv').config({ path: '.env' });
var server = require('http').createServer(app);
var io = require('socket.io')(server);

let ON_CONNECT = 'connection';
let ON_DISCONNECT = 'disconnect';

app.get('/', (req, res) => {
        res.send("Node Server is running. Yay!!")
});

let EVENT_SEND_MESSAGE = 'send_message';
let EVENT_RECEIVE_MESSAGE = 'receive_message';

let listen_port = process.env.PORT;
console.log(process.env.PORT);
server.listen(listen_port);
const userStack = {};
  let oldChats, sendUserStack, setRoom;
  const userSocket = {};
io.sockets.on(ON_CONNECT, function (socket) {
        console.log("connected");
        socket.on("set-user-data", function(username) {
               // console.log(username + "  logged In");
          
                //storing variable.
                socket.username = username;
                userSocket[socket.username] = socket.id;
          
                socket.broadcast.emit("broadcast", {
                  message: username + " Logged In"
                });
	// userSocket.on(EVENT_SEND_MESSAGE, function (chat_message) {
        //         userSocket.broadcast.emit(EVENT_RECEIVE_MESSAGE, chat_message);
        // });
});
});
