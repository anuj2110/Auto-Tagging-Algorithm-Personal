const express = require('express');
const user_middleware = require("../service/user-middleware")
const { user_controller } = require('../controllers/user.controller');

module.exports = () => {
  const router = express.Router();
  //route for showing data
  router.get('/uquestions',user_middleware,user_controller.questions);
  //route for update data
    router.post('/qupdate',user_middleware,user_controller.question_update);
   
  //route for delete data
    router.post('/qdelete',user_middleware,user_controller.question_delete)
  return router;
};