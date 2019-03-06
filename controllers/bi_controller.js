
const { createApolloFetch } = require('apollo-fetch');

const fetch = createApolloFetch({
    uri: 'http://localhost:8000/api',
  });

  
module.exports.getLabelsAndClients = function (req, response) {

fetch({
    query: `query {
        labels {
            agreement_number
            vendor
            effective_date
            end_date
            deal
          }
      }`
  }).then(res => {
    if(res.data) {
        let labels = res.data.labels;
        fetch({
            query: `query {
                clients {
                    client
                  territory
                  origin
                  service_name
                }
              }`
          }).then(result => {
            if(result.data) {
                let clients = result.data.clients;
                response.json({
                    status:200,
                    message:"Success",
                    clients: clients,
                    labels: labels
                 });
            } else {
                console.log(res.errors[0].message);
                response.json({status:500,message:res.errors[0].message});
            }
          });
    } else {
        console.log(res.errors[0].message);
        response.json({status:500,message:res.errors[0].message});
    }
  });
};