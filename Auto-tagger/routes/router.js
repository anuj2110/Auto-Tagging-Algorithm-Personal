const express = require('express');
const auth_controller = require("../controllers/auth.controller")
module.exports = (user_admin)=>{
  const router = express.Router();
  router.get('/login',function(req,res){
    res.render('login')
  });
router.post('/auth',auth_controller.login)
router.get('/sorry',(req,res)=>{
    res.redirect('/login');
  })
router.get('/',function(req,res){
  if (req.session.loggedin) {
      if(req.session.user.role=='admin'){console.log("Inside admin");return res.redirect('/admin')}
      else{console.log("Inside user");return res.redirect('/user')}
      } else {
          res.redirect('/login');
      }
});
router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/login');
        }
      });
    }
  });
  return router;
}