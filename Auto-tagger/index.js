/*MAKING THE IMPORTS FOR THE APP*/ 
//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParse r middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const session = require('express-session');
const axios =  require('axios');
const Sequelize = require('sequelize');
const app = express();
const auth = require("./service/passport");
const flash = require("connect-flash");
//HERE WE USE THE MYSQL MODULE TO CREATE CONNECTION TO THE DB
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
const sequelize = new Sequelize('stats', 'anuj', 'Anuj@21101998', {
  host: 'localhost',
  dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});
//HERE WE CONNECT TO THE DATABASE
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
conn2.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
  });
//CONFIGURING THE APP FOR VARIOUS USE CASES
hbs.registerPartials(__dirname + '/views/partials');//RE
//set views fileGI
// Compares first value to the second one allowing entering IF clouse if true.
// Otherwise entering ELSE clause if exist.
// hbs.registerHelper('ifEquals', function(a, b, options) {
//   if (a === b) {
//     return options.fn(this);
//   }

//   return options.inverse(this);
// });
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
//route for homepage
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
    req.session.user = user;
    // req.session.role=
    return res.redirect('/home');
})
})(req, res, next);

})

app.get('/sorry',(req,res)=>{
  res.render('sorry');
})
app.get('/home',(req,res)=>{
  if (req.session.loggedin) {
    if(req.session.user.role=='admin'){res.render("home",{username:req.session.user.name});}
		else{res.render("home_user",{username:req.session.user.name});}
	} else {
		res.send('Please login to view this page!');
	}
})

app.get('/predict',(req,res)=>{
  
  if (req.session.loggedin) {
    if(req.session.user.role=='admin'){
      res.render("Predict");
    }else{
      res.send("You are not authorised Personnel")
    }
		
	} else {
		res.send('Please login to view this page!');
	}
})

app.post('/predict',(req,res)=>{
  if(req.session.loggedin){
    if(reqq.session.user.role == 'admin'){
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
  //item = JSON.stringify(features)
  //console.log(item)
  axios.post("http://127.0.0.1:5000/",{features})
.then(function (response) {
        console.log(response.data);
        messsage=response.data;
// I need this data here ^^
  console.log(message);

}).catch((err)=>{console.log(err.message)
return res.redirect('back')})
res.render("Predict",{message:message})
    }else(res.send("You are not authorised Personnel"))
  }else(res.send("Please login to view this page"))
})
app.get('/stats',(req,res)=>{
  if (req.session.loggedin) {
		if(req.session.user.role=='admin'){
      sequelize.query("select * from stats_2018").then(([results, metadata]) => {
        // Results will be an empty array and metadata will contain the number of affected rows.
        let array=[]  
        return results;
        //console.log(array);
        
       // console.log(metadata[0].KMeans_labels);
      }).then(results=>{
        console.log("after");
        res.render("stats",{data: JSON.stringify(results)})
    })
    }else(res.send("You are not authorised Personnel"))
	} else {
		res.send('Please login to view this page!');
	}
})
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.get('/users',(req, res) => {
  if(req.session.loggedin){
    if(req.session.user.role == 'admin'){
      let sql = "SELECT * FROM user_question";
      let query = conn.query(sql, (err, results) => {
      if(err) throw err;
      res.render('users',{
        results: results
        });
      });
    }else{res.send("You are not authorised Personnel")}
  }else {
		res.send('Please login to view this page!');
	}
});
 
//route for insert data
app.post('/usave',(req, res) => {
  let data = {user_id:req.body.user_id, question_id: req.body.question_id};
  let sql = "INSERT INTO user_question SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/users');
  });
});
 
//route for update data
app.post('/uupdate',(req, res) => {
  let sql = `UPDATE user_question SET user_id=${req.body.user_id},question_id =${req.body.question_id} where user_id = ${req.body.uid} and question_id = ${req.body.qid}`;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/users');
  });
});
 
//route for delete data
app.post('/udelete',(req, res) => {
  let sql =  `DELETE FROM user_question WHERE user_id = ${req.body.user_id} and question_id = ${req.body.question_id}`;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/users');
  });
});

app.get('/questions',(req, res) => {
  if(req.session.loggedin){
    
      let sql = "SELECT * FROM question_master";
      let query = conn2.query(sql, (err, results) => {
      if(err) throw err;
      res.render('questions',{
        results: results
        });
      });
    }else{res.send("Please login to view this page")}
  
});
app.post('/save',(req, res) => {
  let data = {category_id:req.body.category_id,answer_option1:req.body.answer_option1,difficulty_level:req.body.difficulty_level,pre_tag:req.body.pre_tag,post_tag:req.body.post_tag};
  let sql = "INSERT INTO question_master SET ?";
  let query = conn2.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/questions');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = `UPDATE question_master SET category_id=${req.body.category_id},answer_option1 =${req.body.answer_option1},difficulty_level =${req.body.difficulty_level},pre_tag =${req.body.pre_tag},post_tag:${req.body.post_tag} where id =${req.body.id}`;
  let query = conn2.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/questions');
  });
});
 
//route for delete data
app.post('/delete',(req, res) => {
  let sql =  `DELETE FROM question_master WHERE id = ${req.body.question_id}`;
  let query = conn2.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/questions');
  });
})
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
