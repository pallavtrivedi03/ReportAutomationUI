const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    var token;
    console.log(req.headers.authorization);
    
    if(req.headers.authorization){
      token = req.headers.authorization;
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