if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var router = express.Router();

app.use(express.static(__dirname + 'views'));
app.use('/css',express.static(__dirname +'/views/css'));

app.get('/index', function(req, res){
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

app.get('/chatbox', function(req, res){
    res.sendFile(__dirname + '/views/html/chatbox.html');
});


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)


//chat

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
//setting the required variables

chatters = []; //users array
chatterConnections = []; //connections array

server.listen(process.env.PORT || 2020);  // It will run on localhost:(any number)
console.log("Server Is Up");

io.sockets.on("connection", function(socket){
	//connection stuff
	userConnections.push(socket);
				io.sockets.emit("new user"); //checks if anyone is online

	console.log("chatter connected: %s", userConnections.length);




	// disconnection stuff
	socket.on("disconnect", function(data){

		chatters.splice(chatters.indexOf(socket.username), 1); //accessing the array memers

						io.sockets.emit("chatter left"); //checks if memer left

	userConnections.splice(userConnections.indexOf(socket),1);
	console.log("chatter disconnected: %s ", userConnections.length);
	});

	//send dem meme messages
	socket.on("send message", function(data){
		console.log(data);// shows what the memers typed in console
		io.sockets.emit("new message", {msg: data});


	});



	});
