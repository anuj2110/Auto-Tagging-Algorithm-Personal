const express = require('express');
const user_controller  = require('../controllers/user.controller');

module.exports = (user_middleware) => {
  const router = express.Router();
  //home route
  router.get('/',user_middleware,user_controller.home)
  //route for showing data
  router.get('/uquestions',user_middleware,user_controller.questions);
  //route for update data
  router.post('/qupdate',user_middleware,user_controller.question_update);
  //route for delete data
  router.post('/qdelete',user_middleware,user_controller.question_delete)
  return router;
};