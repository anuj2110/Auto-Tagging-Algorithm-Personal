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
const axios =  require('axios')
const app = express();

//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'anuj',
  password: 'Anuj@21101998',
  database: 'user'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

hbs.registerPartials(__dirname + '/views/partials');
//set views file
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

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      username:req.params.user,
      results: results
    });
  });
});

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
  res.render("home");
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
        console.log(response.data)
        messsage=response.data;
// I need this data here ^^
return response.data;
})

  res.render("Predict",{message:message});
})
app.get('/stats',(req,res)=>{
  res.render("stats");
})
//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
