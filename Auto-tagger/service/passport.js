const passport = require("passport");
const bcrypt = require('bcrypt-nodejs');
const mysql = require("mysql"); 
const LocalStrategy = require("passport-local").Strategy
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

var auth = passport.use(
    'local-login',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        connection.query("SELECT * FROM login WHERE username = ?",[username], function(err, user){
            if (err)
                return done(err);
            if (!user.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user[0]);
        });
    })
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = auth;