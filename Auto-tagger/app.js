/*MAKING THE IMPORTS FOR THE APP*/ 
//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParse r middleware
const bodyParser = require('body-parser');
//used for distinction of different users
const session = require('express-session');
//used for calling flask API
const axios =  require('axios');
//authentication middleware
const auth = require("./service/passport");
const flash = require("connect-flash");
const routes = require('./routes/router')
//instantiating the app
const app = express();

//HERE WE USE THE MYSQL MODULE TO CREATE CONNECTION TO THE DB

//CONFIGURING THE APP FOR VARIOUS USE CASES
hbs.registerPartials(__dirname + '/views/partials');//RE

app.set('views',path.join(__dirname,'views'));
//set view engi
app.set('view engine', 'hbs');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(auth.initialize());
app.use(auth.session());
app.use(flash())
app.use(routes)
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});