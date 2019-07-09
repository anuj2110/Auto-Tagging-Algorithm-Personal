const Sequelize = require('sequelize');
const mysql = require("mysql")
const questions = require("../models/questions")
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
const conn2 = mysql.createConnection({
    host: 'localhost',
    user: 'anuj',
    password: 'Anuj@21101998',
    database: 'auto_tagging_data'
  });
  conn2.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
})
let question_master = questions(sequelize2,Sequelize)
module.exports = {
    home: (req,res)=>{res.render(".user/home_user")},
    questions:(req, res) => {
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
      },
      question_update:(req, res) => {
        let sql = `UPDATE question_master SET category_id=${req.body.category_id},answer_option1 =${req.body.answer_option1},difficulty_level =${req.body.difficulty_level},pre_tag =${req.body.pre_tag},post_tag=${req.body.post_tag} where id =${req.body.id}`;
        let query = conn2.query(sql, (err, results) => {
          if(err) throw err;
          res.redirect('/uquestions');
        });
      },
      question_delete:(req, res) => {
        let sql =  `DELETE FROM question_master WHERE id = ${req.body.question_id}`;
        let query = conn2.query(sql, (err, results) => {
          if(err) throw err;
            res.redirect('/uquestions');
        });
      }
}