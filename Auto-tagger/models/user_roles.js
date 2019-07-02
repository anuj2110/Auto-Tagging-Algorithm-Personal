module.exports = (sequelize, type) => {
    return sequelize.define('Login', {
        // attributes
        userid: {
          type: type.BIGINT(7),
          primaryKey:true,
          autoIncrement:true
        },
        username: {
          type: type.STRING
          // allowNull defaults to true
        },
        name: {
            type: type.STRING
            // allowNull defaults to true
        },
        password: {
            type: type.STRING
        },
        role:{
            type:type.STRING
        }
      },{
        tableName: 'login',
      });
}



