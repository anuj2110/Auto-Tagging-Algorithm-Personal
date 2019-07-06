module.exports = (sequelize, type) => {
    return sequelize.define('Question_master', {
        // attributes
        id: {
          type: type.BIGINT(11),
          primaryKey:true,
          autoIncrement:true
        },
        category_id: {
          type: type.BIGINT(11),
          allowNull: false
        },
        answer_option1: {
            type: type.BIGINT(11),
            allowNull: false
            // allowNull defaults to true
        },
        difficulty_level: {
            type: type.BIGINT(11),
            allowNull: false
        },
        pre_tag:{
            type:type.BIGINT(11),
            allowNull: true
        },
        post_tag:{
            type:type.BIGINT(11),
            allowNull: true
        }
      },{
        tableName: 'question_master',
      });
}