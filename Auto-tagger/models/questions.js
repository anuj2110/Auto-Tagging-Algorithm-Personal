module.exports = (sequelize, type) => {
    return sequelize.define('login', {
        // attributes
        id: {
          type: type.BIGINT(11),
          primaryKey:true,
          autoIncrement:true
        },
        category_id: {
          type: type.BIGINT(11)
          // allowNull defaults to true
        },
        answer_option1: {
            type: type.BIGINT(11)
            // allowNull defaults to true
        },
        difficulty_level: {
            type: type.BIGINT(11)
        },
        pre_tag:{
            type:type.BIGINT(11)
        },
        post_tag:{
            type:type.BIGINT(11)
        }
      });
}