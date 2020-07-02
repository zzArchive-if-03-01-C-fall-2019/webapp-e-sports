const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


var router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + 'views'));
app.use('/css',express.static(__dirname +'/views/css'));

app.get('', function(req, res){
    res.sendFile(__dirname + '/views/html/index.html');
});

app.get('/lol', function(req, res){
    res.sendFile(__dirname + '/views/html/lol.html');
});

app.get('/lolteams', function(req, res){
    res.sendFile(__dirname + '/views/html/lolteams.html');
});

app.get('/csgo', function(req, res){
    res.sendFile(__dirname + '/views/html/csgo.html');
});

app.get('/csgoteams', function(req, res){
    res.sendFile(__dirname + '/views/html/csgoteams.html');
});

app.get('/changelog', function(req, res){
    res.sendFile(__dirname + '/views/html/changelog.html');
});

app.get('/astralis', function(req, res){
    res.sendFile(__dirname + '/views/html/astralis.html');
});

app.get('/damwon', function(req, res){
    res.sendFile(__dirname + '/views/html/damwon.html');
});

app.get('/fnatic', function(req, res){
    res.sendFile(__dirname + '/views/html/fnatic.html');
});

app.get('/fnaticlol', function(req, res){
    res.sendFile(__dirname + '/views/html/fnaticlol.html');
});

app.get('/fpx', function(req, res){
    res.sendFile(__dirname + '/views/html/fpx.html');
});

app.get('/g2', function(req, res){
    res.sendFile(__dirname + '/views/html/g2.html');
});

app.get('/g2lol', function(req, res){
    res.sendFile(__dirname + '/views/html/g2lol.html');
});

app.get('/mousesports', function(req, res){
    res.sendFile(__dirname + '/views/html/mousesports.html');
});

app.get('/navi', function(req, res){
    res.sendFile(__dirname + '/views/html/navi.html');
});

app.get('/t1', function(req, res){
    res.sendFile(__dirname + '/views/html/t1.html');
});

app.get('/t1', function(req, res){
    res.sendFile(__dirname + '/views/html/t1.html');
});

app.get('/chatstart', function(req, res){
    res.sendFile(__dirname + '/public/chatstart.html');
});

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/public/chat.html');
});


const botName = 'Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Chatbox!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


 
