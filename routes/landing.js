const express = require('express');
const router = express.Router();
const biController = require('../controllers/bi_controller');

router.get('/', function(req, res, next) {
    res.render('404');
});

router.post('/', function(req, res, next) {
    console.log("role is "+req.body.role);
    
    switch(req.body.role) {
        case "admin":    
        res.render('admin');
          break;
        case "BI":
        res.render('bi_home');
          break;
        case "CA":
        res.render('ca_home');
          break;
        case "FA":
        res.render('fa_home');
          break;
        default:
          res.render('404');
      }
});

router.get('/labelsAndClients', function(req, res, next) {
  biController.getLabelsAndClients(req,res);
});

router.post("/uploadReport", upload.single('fileName'), function (req, res) {

  console.log("Request received");
  //text fields
  console.log(req.body);

  //file contents
  console.log(req.file);

  console.log(String(req.file.buffer));
 
  res.json({status: 200, message: "Success"});

});



module.exports = router;
