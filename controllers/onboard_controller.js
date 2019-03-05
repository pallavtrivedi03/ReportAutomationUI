
const { createApolloFetch } = require('apollo-fetch');

const fetch = createApolloFetch({
    uri: 'http://localhost:8000/api',
  });

  
module.exports.login = function (req, response) {
    const username = req.body.email;
    const password = req.body.password;

fetch({
    query: `query {
        login(email:"${username}",password:"${password}") {
          userId
          role
          token
          tokenExpiration
        }
      }`
  }).then(res => {
    if(res.data) {
        console.log(res.data);
        response.json({
            status:200,
            message:"Success",
            userId: res.data.login.userId,
            role: res.data.login.role,
            token: res.data.login.token,
            tokenExpiration: res.data.login.tokenExpiration,
            redirectTo: "/landing"
         });
    } else {
        console.log(res.errors[0].message);
        response.json({status:500,message:res.errors[0].message});
    }
  });
};