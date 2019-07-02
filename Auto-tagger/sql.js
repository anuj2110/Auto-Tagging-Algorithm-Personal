const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('stats', 'anuj', 'Anuj@21101998', {
  host: 'localhost',
  dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

// // Option 2: Passing a connection URI
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// const mysql = require('mysql');
// const conn= mysql.createConnection({
//     host: 'localhost',
//     user: 'anuj',
//     password: 'Anuj@21101998',
//     database: 'stats'
//   })
// conn.connect((err) =>{
//     if(err) throw err;
//     console.log('Mysql Connected...');
//   });


//  await  conn.query("select KMeans_labels from stats_2018");
// // let res=  conn.query("select KMeans_labels from stats_2018",(err, results) => {
// //     if(err) throw err;
// //     var r = [];
// //     //console.log(results[0].KMeans_labels);
  
// //      return Object.values(JSON.parse(JSON.stringify(results)))    
// // });

sequelize
  .authenticate()
  .then(() => {
   
sequelize.query("select * from stats_2018").then(([results, metadata]) => {
      // Results will be an empty array and metadata will contain the number of affected rows.
      let array=[]
      array.push(JSON.parse(JSON.stringify(results)),JSON.parse(JSON.stringify(metadata)));;
      //console.log(array);
     // console.log(metadata[0].KMeans_labels);
    }).then(results=>{
      console.log("after");
      console.log(JSON.stringify(results));
  })
    
  })    
