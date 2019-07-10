const express = require('express');
const admin_controller  = require('../controllers/admin.controller');

module.exports = (admin_middleware) => {
  const router = express.Router();
  //home route
  router.get('/',admin_middleware,admin_controller.home)
  //route for showing the user data
  router.get('/users',admin_middleware,admin_controller.users);
  //route for adding a new user with assigned question id
  router.post('/usave',admin_middleware,admin_controller.users_create);
  //route for update user data
  router.post('/uupdate',admin_middleware,admin_controller.users_update);
  //route for delete user data
  router.post('/udelete',admin_middleware,admin_controller.users_delete);
  //route for ahowing the question
  router.get('/questions',admin_middleware,admin_controller.questions);
  //route for showing the form
  router.get('/predict',admin_middleware,admin_controller.predict);
  //route for getting the results from the flask REST API via form data
  router.post('/predict',admin_middleware,admin_controller.predict_request);
  //route for showing the statistics
  router.get('/stats',admin_middleware,admin_controller.stats);
  return router;
};