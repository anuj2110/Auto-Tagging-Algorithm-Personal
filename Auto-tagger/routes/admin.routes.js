const express = require('express');
const admin_controller  = require('../controllers/admin.controller');

module.exports = (admin_middleware) => {
  const router = express.Router();
  router.get('/',admin_middleware,admin_controller.home)
  router.get('/users',admin_middleware,admin_controller.users);
  router.post('/usave',admin_middleware,admin_controller.users_create);
     
    //route for update data
  router.post('/uupdate',admin_middleware,admin_controller.users_update);
     
    //route for delete data
  router.post('/udelete',admin_middleware,admin_controller.users_delete);
  router.get('/questions',admin_middleware,admin_controller.questions)
  router.get('/predict',admin_middleware,admin_controller.predict)
  router.post('/predict',admin_middleware,admin_controller.predict_request)
  router.get('/stats',admin_middleware,admin_controller.stats)
  return router;
};