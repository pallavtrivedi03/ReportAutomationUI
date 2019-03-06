// Global Variables
var clients;
var labels;

function getLabelAndClients() {
    $.ajax({
        type:"GET",
        url:"/landing/labelsAndClients",
      headers:{
        authorization: sessionStorage.getItem("token")
      },
        success: function(response){
            if(response.status == 200) {
              clients = response.clients;
              labels = response.labels;
              populateLabelsControl();
            } else {
              alert('Something went wrong');
            }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert("Something went wrong"); //Handle the timeout
      }
      });
}

function populateLabelsControl() {
    $.each(labels, function(key, value) {   
        $('#labelSelectControl')
            .append($("<option></option>")
                       .attr("value",value.agreement_number)
                       .text(value.vendor)); 
   });

   $.each(clients, function(key, value) {   
    $('#clientSelectControl1')
        .append($("<option></option>")
                   .attr("value",value.client)
                   .text(value.client)); 
    });
   updateDealsControl(labels[0].agreement_number);
}

function updateDealsControl(agreement_number) {
    $('#dealSelectControl').empty();
    var selectedLabel = labels.filter((e) => {
        return e.agreement_number == agreement_number;
    });
    $('#dealSelectControl') 
        .append($("<option></option>")
        .attr("value",selectedLabel[0].agreement_number)
        .text(selectedLabel[0].deal)); 
}