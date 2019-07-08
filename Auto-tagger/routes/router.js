const express = require('express');
const user_admin = require("../service/user-admin-middleware")
const auth_controller = require("../controllers/auth.controller")
const router = express.Router();
router.get('/login',function(req,res){
    res.render('login')
  });
router.post('/auth',auth_controller.login)
router.get('/sorry',(req,res)=>{
    res.render('sorry');
  })
router.get('/',user_admin,(req,res)=>{});
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
  
module.exports = router