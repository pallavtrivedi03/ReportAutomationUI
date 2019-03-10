const express = require('express');
const multer = require('multer');
const biController = require('../controllers/bi_controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'reports')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({storage: storage});

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

router.post("/uploadReport", upload.single('file'), function (req, res) {

  //file contents
  console.log(req.file);
 console.log("Path is "+req.file.path);
 biController.getPreviewData(res,req.file.path);

});

router.post("/submitReport", function (req, res) {
  console.log(req.headers.reportjson);
  console.log(req.body);
  res.json({status:200,message:"Success"});
});

module.exports = router;
