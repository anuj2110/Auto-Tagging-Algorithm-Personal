const express = require('express');
const admin_middleware = require("../service/role_middleware")
const { admin_controller } = require('../controllers/admin.controller');

module.exports = () => {
  const router = express.Router();
  router.get('/users',admin_middleware,admin_controller.users);
  router.post('/usave',admin_controller.users_create);
     
    //route for update data
  router.post('/uupdate',admin_controller.users_update);
     
    //route for delete data
  router.post('/udelete',admin_controller.users_delete);
  router.get('/questions',admin_controller.questions)
  router.get('/predict',admin_middleware,admin_controller.predict)
  router.post('/predict',admin_middleware,admin_controller.predict_request)
  router.get('/stats',admin_middleware,admin_controller.stats)
  return router;
};