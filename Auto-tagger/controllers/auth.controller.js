const auth = require("../service/passport");
const flash = require("connect-flash");
module.exports = {
    login:
        (req, res, next)=> {
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
                req.session.user = user;
                // req.session.role=
                return res.redirect('/');
            })
            })(req, res, next);
          }
    }
