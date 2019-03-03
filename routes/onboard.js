const express = require('express');
const onboardController = require('../controllers/onboard_controller');

const router = express.Router();

router.get('/', function(req, res, next) {
  
});

router.post('/login', function(req, res, next) {
  onboardController.login(req,res);
});

module.exports = router;
