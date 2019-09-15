
const { createApolloFetch } = require('apollo-fetch');
const xlsx = require('xlsx');

const fetch = createApolloFetch({
  uri: 'http://localhost:8000/api',
});


module.exports.getLabelsAndClients = function (req, response) {

  fetch({
    query: `query {
      labels {
        _id
        vendor
        agreements {
          agreementNumber
          effectiveDate
          endDate
          deal
        }
      }
    }`
  }).then(res => {
    if (res.data) {
      let labels = res.data.labels;
      fetch({
        query: `query {
              clients {
                _id
                client
                services {
                  name
                  regionInfo {
                    origin
                    territory
                  }
                }
              }
            }`
      }).then(result => {
        if (result.data) {
          let clients = result.data.clients;
          response.json({
            status: 200,
            message: "Success",
            clients: clients,
            labels: labels
          });
        } else {
          console.log(res.errors[0].message);
          response.json({ status: 500, message: res.errors[0].message });
        }
      });
    } else {
      console.log(res.errors[0].message);
      response.json({ status: 500, message: res.errors[0].message });
    }
  });
};

module.exports.getPreviewData = async function (res, path) {
  var workbook = xlsx.readFile(path);
  var sheets = workbook.SheetNames;
  console.log(sheets);
  var result = [];
  for (var i = 0; i < sheets.length; i++) {
    var parsedJson = await getParsedSheet(workbook.Sheets[sheets[i]]);
    result.push(parsedJson);
  }
  res.json({ status: 200, message: "Success", path:path, data: result });

}


module.exports.submitReport = function (headers, params, response) {
  console.log("check");
  
  let path = headers.path;
  let jsonData = headers.data;
  let label = params.labelSelectControl;
  let deal = params.dealSelectControl;
  let type = params.reportType;
  let from = params.fromDateField;
  let to = params.toDateField;

  let clientCount = parseInt(params.clientCount);
  var clients = [];
  for(var i=1; i<=clientCount; i++) {
    let clientNameKey = "clientSelectControl"+i;
    let serviceNameKey = "serviceSelectControl"+i;
    let originNameKey = "originSelectControl"+i;
    
    var client = {client:params[clientNameKey],service:params[serviceNameKey],origin:params[originNameKey] };
    clients.push(client);
  }
  
  // res.json({status:200,message:"Success"});
  // fetch({
  //   query: `mutation {
  //     createReport(reportInput: 
  //       {
  //         label:"Binaca", 
  //         deal:"Some Deal", 
  //         type:"Complete",
  //         from:"12/12/2018",
  //         to:"1/12/2019",
  //         path:"path/to/report",
  //         reportJson:"someJsonToBeStored",
  //         clients:	[
  //           {
  //             client:"Airtel",
  //             service:"Music",
  //             origin:"India"
  //           }
  //         ]
  //       }) {
  //       label,
  //       from,
  //       to,
  //       type,
  //       clients {
  //         client
  //       }
  //     }
  //   }`
  // }).then(res => {
  //   if (res.data) {
  //     let labels = res.data.labels;
      
  //   } else {
  //     console.log(res.errors[0].message);
  //     response.json({ status: 500, message: res.errors[0].message });
  //   }
  // });
};


function getParsedSheet(sheet) {
  var json = xlsx.utils.sheet_to_json(sheet, {cellDates:true, cellNF:false, cellText:false});
  return json;
}