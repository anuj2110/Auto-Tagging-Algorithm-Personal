/*MAKING THE IMPORTS FOR THE APP*/ 

// Option 1: Passing parameters separately


//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const session = require('express-session');
const axios =  require('axios');
const Sequelize = require('sequelize');
const app = express();
const auth = require("./service/passport");
//HERE WE USE THE MYSQL MODULE TO CREATE CONNECTION TO THE DB
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'anuj',
  password: 'Anuj@21101998',
  database: 'user'
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
// conn2.connect((err) =>{
//   if(err) throw err;
//   console.log('Mysql Connected...');
// });
//CONFIGURING THE APP FOR VARIOUS USE CASES
hbs.registerPartials(__dirname + '/views/partials');//RE
//set views fileGI
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
//route for homepage
app.get('/',function(req,res){
  res.render('login')
});

app.post('/auth', (req, res, next) => {
console.log('Inside POST /login callback')
auth.authenticate('local-login', (err, user, info) => {
  if(info) {return res.send(info.message)}
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
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


//route for insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/');
  });
});
app.get('/home',(req,res)=>{
  res.render("home",{username:req.session.username});
})
app.get('/users',(req,res)=>{
  res.render("users");
})
app.get('/predict',(req,res)=>{
  res.render("Predict");
})
app.post('/predict',(req,res)=>{
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
        console.log("response.data");
        messsage=response.data;
// I need this data here ^^
  console.log(message);

}).catch((err)=>{console.log(err.message)
return res.redirect('back')})
res.render("Predict",{message:message})
})
app.get('/stats',(req,res)=>{
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
  
})
app.get('/stats_data',(req,res)=>{
//   kmeans_tag= []
//   conn2.query("select KMeans_labels from stats_2018",(err, results) => {
//       if(err) throw err;
//       var r = [];
//       Object.keys(results).forEach(function(key) {
//           var row = results[key];
//           r = r.concat(row["KMeans_labels"])
//         });
//         kmeans_tag= r
//   }
//   );
//   console.log(kmeans_tag)
//   SOM_tag= []
//   conn2.query("select SOM_labels from stats_2018",(err, results) => {
//       if(err) throw err;
//       var r = [];
//       Object.keys(results).forEach(function(key) {
//           var row = results[key];
//           r = r.concat(row["SOM_labels"])
//         });
//         SOM_tag= r
//   }
//   );
//   console.log(SOM_tag)
//   var kmeans_acc =0;
//   conn2.query("select accuracy_KMeans from accuracy_2018",(err, results) => {
//     if(err) throw err;
//     var r = 0;
//     Object.keys(results).forEach(function(key) {
//         var row = results[key];
//         r = row["accuracy_KMeans"]
//       });
//       kmeans_acc = r;
// }
// );
// console.log(kmeans_acc)
// var som_acc=0;
//   conn2.query("select accuraacy_SOM from accuracy_2018",(err, results) => {
//     if(err) throw err;
//     var r = 0;
//     console.log(results);
//     Object.keys(results).forEach(function(key) {
//         var row = results[key];
//         r = row["accuracy_SOM"]
//       });
//       som_acc = r;
// });
// console.log(som_acc)
// kmeans_2 = kmeans_tag.filter(i => i === 2).length
// kmeans_1 = kmeans_tag.filter(i => i === 1).length
// kmeans_0 = kmeans_tag.filter(i => i === 0).length

// SOM_2 = kmeans_tag.filter(i => i === 2).length
// SOM_1 = kmeans_tag.filter(i => i === 1).length
// SOM_0 = kmeans_tag.filter(i => i === 0).length
// data ={
//   'kmeans_tag' : kmeans_tag,
//   'SOM_tag' : SOM_tag,
//   'kmeans_acc' : kmeans_acc,
//   'som_acc' : som_acc,
//   'kmeans_2' : kmeans_2,
//   'kmeans_1' : kmeans_2,
//   'kmeans_0' : kmeans_2,
//   'SOM_2' : SOM_2,
//   'SOM_1' : SOM_1,
//   'SOM_0' : SOM_0,
// }
// return JSON.stringify(data);
sequelize.query("select * from stats_2018").then(([results, metadata]) => {
  // Results will be an empty array and metadata will contain the number of affected rows.
  let array=[]
  return JSON.stringify(metadata)
  //console.log(array);
  
 // console.log(metadata[0].KMeans_labels);
})
});
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
