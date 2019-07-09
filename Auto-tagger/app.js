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
//authentication middleware
const auth = require("./service/passport");
const flash = require("connect-flash");
//user_admin middleware for distinction
const user_admin = require("./service/role_middleware")
//user middleware for user specific pages
const user_middleware = require("./service/user-middleware")
//admin middleware for admin specific pages
const admin_middleware = require("./service/role_middleware")
//routes file for user authentication and authorization
const auth_routes = require('./routes/router')(user_admin)
//routes file for admin based routes
const admin_routes = require("./routes/admin.routes")(admin_middleware)
//routes file for user based routes
const user_routes = require("./routes/user.routes")(user_middleware)
//instantiating the app
const app = express();
//CONFIGURING THE APP FOR VARIOUS USE CASES
hbs.registerPartials(__dirname + '/views/partials');//Registering the partials file which will be included in the hbs files
app.set('views',path.join(__dirname,'views'));//Registering the view pages as the pages to be used in app
app.set('view engine', 'hbs');//set view engine
app.use('/static', express.static(path.join(__dirname, 'public')));//Registering static files such as the JavaScript,CSS etc
app.use(bodyParser.json());//using the bodyparser module to parse the body of HTML/HBS
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));//using sessions for making different sessions for user at login
app.use(auth.initialize());//setting the authentication and authorization control
app.use(auth.session());//setting up the session for authentication and authorization control
app.use(flash())
app.use('/',auth_routes)//setting routes for authentication
app.use('/admin',admin_routes)//setting routes for admin
app.use('/user',user_routes)//setting routes for user
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});