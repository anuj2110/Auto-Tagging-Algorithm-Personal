const mysql = require("mysql")
const Sequelize = require('sequelize');
const axios = require("axios")
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'anuj',
    password: 'Anuj@21101998',
    database: 'user'
});
conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});
const sequelize1 = new Sequelize('stats', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});
const sequelize2 = new Sequelize('auto_tagging_data', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    }
});
module.exports = {
    home: (req,res)=>{res.render("./admin/home",{username:req.session.user.name})},
    users: (req, res) => {
        let sql = "SELECT * FROM user_question";
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.render('./admin/users', {
                results: results,username:req.session.user.name
            });
        });
    },
    users_create: (req, res) => {
        let data = { user_id: req.body.user_id, question_id: req.body.question_id };
        let sql = "INSERT INTO user_question SET ?";
        let query = conn.query(sql, data, (err, results) => {
            if (err) throw err;
            res.redirect('/admin/users');
        });
    },
    users_update: (req, res) => {
        let sql = `UPDATE user_question SET user_id=${req.body.user_id},question_id =${req.body.question_id} where user_id = ${req.body.uid} and question_id = ${req.body.qid}`;
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/admin/users');
        });
    },
    users_delete: (req, res) => {
        let sql = `DELETE FROM user_question WHERE user_id = ${req.body.user_id} and question_id = ${req.body.question_id}`;
        let query = conn.query(sql, (err, results) => {
            if (err) throw err;
            res.redirect('/admin/users');
        });
    },
    predict: (req, res) => {
        var message = ""
        message = req.query.message
        res.render("./admin/Predict", { message: message,username:req.session.user.name });
    },
    questions: (req, res) => {
        sequelize2.query("select * from question_master").then((results) => {
            res.render('./admin/admin_ques', { results: results[0],username:req.session.user.name });
        })

    },
    predict_request: (req, res) => {

        var features = [];
        var message = "Accuraacy";
        var dummy = [req.body.year,
        req.body.correctly_answered,
        req.body.incorretly_answered,
        req.body.not_answered,
        req.body.avg_marks_correctly_answered,
        req.body.avg_marks_incorrectly_answered,
        req.body.avg_marks_not_answered,
        req.body.F1,
        req.body.F2];
        for (var i = 0; i < dummy.length; i++) {
            if (dummy[i] != undefined) {
                features = features.concat(dummy[i]);
            }
        }
        if (features.length === 1) {
            res.render("./admin/Predict", {message1: "Please select atleat 1 feature"});
        }
        else {

            axios.post("http://127.0.0.1:5000/", { features }).then(function (response) {
                console.log(response.data);
                messsage = response.data;
                return res.render("./admin/Predict", {message2: "Please head to stats page for insights in result" })
            }).catch((err) => {
                console.log(err.message)
                return res.redirect('back')
            }
            )
            
        }
    },
    stats:(req,res)=>{
        sequelize1.query("select * from stats_2018").then(([results, metadata]) => {
          // Results will be an empty array and metadata will contain the number of affected rows.
          let array=[]  
          return results;
          //console.log(array);
          
         // console.log(metadata[0].KMeans_labels);
        }).then(results=>{
          sequelize2.query("select * from features_2018").then(([stats, metadata]) => {
            // Results will be an empty array and metadata will contain the number of affected rows.
            let array=[]  
            res.render("./admin/stats",{data: JSON.stringify(results),stats: JSON.stringify(stats),username:req.session.user.name})
          })
          
      })

  }
}