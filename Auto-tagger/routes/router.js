const express = require('express');
const Sequelize = require('sequelize');
//authentication middleware
const auth = require("../service/passport");
const flash = require("connect-flash");
//importing the questions model
const questions = require("../models/questions")
const mysql = require('mysql');
const admin_middleware = require("../service/role_middleware")
const user_admin = require("../service/user-admin-middleware")
const user_middleware = require("../service/user-middleware")
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'anuj',
    password: 'Anuj@21101998',
    database: 'user'
  });
  const conn2 = mysql.createConnection({
    host: 'localhost',
    user: 'anuj',
    password: 'Anuj@21101998',
    database: 'auto_tagging_data'
  });
  const sequelize1 = new Sequelize('stats', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect:'mysql',
    define:{
      timestamps:false
    } 
  });
  const sequelize2 = new Sequelize('auto_tagging_data', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect:'mysql',
    define:{
      timestamps:false
    } 
  });
  const sequelize3 = new Sequelize('user', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect:'mysql',
    define:{
      timestamps:false
    } 
  });
  let question_master = questions(sequelize2,Sequelize)
  //HERE WE CONNECT TO THE DATABASE
  conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });
  conn2.connect((err) =>{
      if(err) throw err;
      console.log('Mysql Connected...');
    });
const router = express.Router();
router.get('/login',function(req,res){
    res.render('login')
  });
  
router.post('/auth', (req, res, next) => {
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
})
  
router.get('/sorry',(req,res)=>{
    res.render('sorry');
  })
router.get('/',user_admin,(req,res)=>{
});
router.get('/users',admin_middleware,(req, res) => {
    let sql = "SELECT * FROM user_question";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
            res.render('./admin/users',{
                results: results
            });
    });
});
router.post('/usave',(req, res) => {
    let data = {user_id:req.body.user_id, question_id: req.body.question_id};
    let sql = "INSERT INTO user_question SET ?";
    let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/users');
    });
  });
   
  //route for update data
router.post('/uupdate',(req, res) => {
    let sql = `UPDATE user_question SET user_id=${req.body.user_id},question_id =${req.body.question_id} where user_id = ${req.body.uid} and question_id = ${req.body.qid}`;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/users');
    });
  });
   
  //route for delete data
router.post('/udelete',(req, res) => {
    let sql =  `DELETE FROM user_question WHERE user_id = ${req.body.user_id} and question_id = ${req.body.question_id}`;
    let query = conn.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/users');
    });
  });
  router.get('/predict',admin_middleware,(req,res)=>{
          res.render("./admin/Predict");
  })
router.get('/questions',(req,res)=>{
    sequelize2.query("select * from question_master").then((results)=>{
      console.log(results[0])
      res.render('./admin/admin_ques',{results:results[0]});
    })
    
  })
router.post('/predict',admin_middleware,(req,res)=>{
   
        var features = [];
        var message = '';
        var dummy = [req.body.year,
        req.body.correctly_answered,
        req.body.incorretly_answered,
        req.body.not_answered,
        req.body.avg_marks_correctly_answered,
        req.body.avg_marks_incorrectly_answered,
        req.body.avg_marks_not_answered,
        req.body.F1,
        req.body.F2];
        for(var i= 0;i<dummy.length;i++)
        {
                if(dummy[i]!=undefined){
                features = features.concat(dummy[i]);
                }
        }
    
        axios.post("http://127.0.0.1:5000/",{features})
    .then(function (response) {
            console.log(response.data);
            messsage=response.data;
    // I need this data here ^^
        console.log(message);
    }).catch((err)=>{console.log(err.message)
    return res.redirect('back')})
    res.render("Predict",{message:message})
      
  })
router.get('/stats',admin_middleware,(req,res)=>{
        sequelize1.query("select * from stats_2018").then(([results, metadata]) => {
          // Results will be an empty array and metadata will contain the number of affected rows.
          let array=[]  
          return results;
          //console.log(array);
          
         // console.log(metadata[0].KMeans_labels);
        }).then(results=>{
          console.log("after");
          res.render("./admin/stats",{data: JSON.stringify(results)})
      })
  })
router.get('/uquestions',user_middleware,(req, res) => {
    let sql = `select question_id from user_question where user_id = ${req.session.user.userid}`;
        let query = sequelize3.query(sql).then((results0)=>{
          var results = []
          for(var i= 0;i<results0[0].length;++i){
            results.push(results0[0][i].question_id)
          }
          question_master.findAll({
            where:{
              id:results
            }
          }).then((results1)=>{
            res.render("./user/questions",{results:results1})
          })
        })
  });
  //route for update data
router.post('/qupdate',user_middleware,(req, res) => {
    let sql = `UPDATE question_master SET category_id=${req.body.category_id},answer_option1 =${req.body.answer_option1},difficulty_level =${req.body.difficulty_level},pre_tag =${req.body.pre_tag},post_tag=${req.body.post_tag} where id =${req.body.id}`;
    let query = conn2.query(sql, (err, results) => {
      if(err) throw err;
      res.redirect('/uquestions');
    });
  });
   
  //route for delete data
router.post('/qdelete',user_middleware,(req, res) => {
    let sql =  `DELETE FROM question_master WHERE id = ${req.body.question_id}`;
    let query = conn2.query(sql, (err, results) => {
      if(err) throw err;
        res.redirect('/uquestions');
    });
  })
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