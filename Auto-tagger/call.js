const Sequelize = require('sequelize');
const sequelize = new Sequelize('user', 'anuj', 'Anuj@21101998', {
    host: 'localhost',
    dialect:'mysql',
    define:{
      timestamps:false
    }
     /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });
const model = require('./models/user_roles')
const model2 = require('./models/user_question')
let login = model(sequelize,Sequelize)
let uq = model2(sequelize,Sequelize)
var findUser =async function(userId){
     return await login.findAll({
        where: {
           userid: userId
        }
     }).then((user)=> {
        if (!user) {
            return 'not find';
        }
        
        return user;
     });
};
var res = findUser(1)
var res2 = 0;
res.then((user)=>{
  sequelize.query(`select question_id from user_question where user_id =2`).then((res)=>{
    console.log(res[0][0].question_id)
  })
})

