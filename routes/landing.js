const express = require('express');

const router = express.Router();

router.get('/', function(req, res, next) {
    res.render('404');
});

router.post('/', function(req, res, next) {
    res.render('home');
});


module.exports = router;
