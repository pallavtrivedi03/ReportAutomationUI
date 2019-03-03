const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token;
    if(req.headers.token){
      token = req.headers.token;
    }
    else if(req.query.token){
      token = req.query.token;
    } else if(req.body.token){
      token = req.body.token;
    } else {
      res.render('404');
      return;
    }
    
    jwt.verify(token,'somesupersecretkey',function(err,decoded){
          if(!err){
              next();
          } else {
            console.log(err);
            res.render('404');    
          }
        
    });
};