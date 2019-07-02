// telling the program what to import in variables
var express = require("express"); // for web development
var session = require("express-session"); // for handling sessions
var bodyParser = require("body-parser"); // to extract data from login page
var mysql = require("mysql"); // for connecting to mysql database
const auth = require("./service/passport");
var path = require('path');
const hbs = require('hbs');
const flash  = require("connect-flash")
//making the onnection to the databse
var connection =  mysql.createConnection({
    host : "localhost",
    user : "anuj",
    password : "Anuj@21101998",
    database : "user"
})

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });


// auth.serializeUser(function(user, done) {
//   done(null, user);
// });
// auth.deserializeUser(function(user, done) {
//   done(null, user);
// });

var app = express();//intializing the app

//to let Express know we'll be using some of its packages
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(auth.initialize());
app.use(auth.session());
app.use(flash())
app.set('views',path.join(__dirname,'views'));
//set view engi
app.set('view engine', 'hbs');
app.use('/static', express.static(path.join(__dirname, 'public')));


app.get('/',function(req,res){
    res.render('login')
});

app.post('/auth', (req, res, next) => {
  console.log('Inside POST /login callback')
  auth.authenticate('local-login', (err, user, info) => {
    if(info) {return res.send(info.message)}
    if (err) { return next(err); }
    if (!user) { return res.redirect('/sorry'); }
    req.login(user, (err) => {
      console.log(user);
      if (err) { req.session.destroy();
        return next(err); 
      }
      req.session.loggedin = true;
      req.session.username = req.body.username;
      return res.redirect('/home');
  })
  })(req, res, next);
  
})

app.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
})

app.listen(3000) 