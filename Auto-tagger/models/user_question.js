module.exports = (sequelize, type) => {
    return sequelize.define('User_question', {
        // attributes
        user_id: {
            type: type.BIGINT(7)
            
        },
        question_id:{
            type:type.BIGINT(11)
        }
      },{
        tableName: 'user_question',
      });
}