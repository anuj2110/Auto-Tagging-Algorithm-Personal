// telling the program what to import in variables
var express = require("express"); // for web development
var session = require("express-session"); // for handling sessions
var bodyParser = require("body-parser"); // to extract data from login page
var mysql = require("mysql"); // for connecting to mysql database
var path = require('path');

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

var app = express();//intializing the app

//to let Express know we'll be using some of its packages
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+"/login.html"));
});

app.post('/auth',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username && password){
        connection.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password],function(error,results,fields){
            if (error) {
                return console.error('error: ' + err.message);
              }
            if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
        })
    }
    else {
		res.send('Please enter Username and Password!');
		res.end();
	}
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