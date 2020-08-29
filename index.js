var express = require('express');
const mongoose = require("mongoose");
var app = express();
require('dotenv').config({ path: '.env' });
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const events = require("events");
const _ = require("lodash");

const eventEmitter = new events.EventEmitter();

//adding db modelss
const userModel=require('./src/models/user.js');
const chatModel=require('./src/models/chat.js');
const roomModel=require('./src/models/room.js');
//require("const Video=require('../models/video.model.js');");
//require("../../src/models/room.js");


// //using mongoose Schema models
// const userModel = mongoose.model("User");
// const chatModel = mongoose.model("Chat");
// const roomModel = mongoose.model("Room");
let ON_CONNECT = 'connection';
let ON_DISCONNECT = 'disconnect';
let EVENT_SEND_MESSAGE = 'send_message';
let EVENT_RECEIVE_MESSAGE = 'receive_message';
let listen_port = process.env.PORT;
let oldChats, sendUserStack, setRoom;
const userStack = {};
 
 
app.get('/', (req, res) => {
        res.send("Node Server is running. Yay!!")
});

const dbPath = `mongodb+srv://shanti:shanti@database-niaxb.mongodb.net/labbaikDataBase?retryWrites=true&w=majority`;
mongoose.connect(dbPath, { useNewUrlParser: true });
mongoose.connection.once("open", function() {
  console.log("Database Connection Established Successfully.");
});


console.log(process.env.PORT);
server.listen(listen_port);

io.sockets.on(ON_CONNECT, function (socket) {
        console.log("connected");
         //function to get user name
        socket.on("set-user-data", function(username) {
               // console.log(username + "  logged In");
          
                //storing variable.
                socket.username = username;
                userSocket[socket.username] = socket.id;
          
                socket.broadcast.emit("broadcast", username);

        //getting all users list
      eventEmitter.emit("get-all-users");

      //sending all users list. and setting if online or offline.
      sendUserStack = function() {
        for (i in userSocket) {
          for (j in userStack) {
            if (j == i) {
              userStack[j] = "Online";
            }
          }
        }
        //for popping connection message.
        ioChat.emit("onlineStack", userStack);

      }; //end of sendUserStack function.
    }); //end of set-user-data event.

});
// userSocket.on(EVENT_SEND_MESSAGE, function (chat_message) {
        //         userSocket.broadcast.emit(EVENT_RECEIVE_MESSAGE, chat_message);
        // });
         //listening for get-all-users event. creating list of all users.
  eventEmitter.on("get-all-users", function() {
        userModel
          .find({})
          .select("username")
          .exec(function(err, result) {
            if (err) {
              console.log("Error : " + err);
            } else {
              //console.log(result);
              for (var i = 0; i < result.length; i++) {
                userStack[result[i].username] = "Offline";
              }
              //console.log("stack "+Object.keys(userStack));
              sendUserStack();
            }
          });
      }); //end of get-all-users event.
