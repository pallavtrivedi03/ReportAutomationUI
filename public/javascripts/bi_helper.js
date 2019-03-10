// Global Variables
var clients;
var labels;
var numberOfClients = 1;
var parsedReportJson;

// Webservice Calls
function getLabelAndClients() {
  $.ajax({
    type: "GET",
    url: "/landing/labelsAndClients",
    headers: {
      authorization: sessionStorage.getItem("token")
    },
    success: function (response) {
      if (response.status == 200) {
        clients = response.clients;
        labels = response.labels;
        populateControl();
      } else {
        alert('Something went wrong');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("Something went wrong"); //Handle the timeout
    }
  });
}

// Helper Methods
function populateControl() {
  $.each(labels, function (key, value) {
    $('#labelSelectControl')
      .append($("<option></option>")
        .attr("value", value.vendor)
        .text(value.vendor));
  });

  $.each(clients, function (key, value) {
    $('#clientSelectControl1')
      .append($("<option></option>")
        .attr("value", value.client)
        .text(value.client));
  });
  updateDealsControl(labels[0].vendor);
  updateServiceControl1(clients[0].client);
}

function progress(e) {
  if (e.lengthComputable) {
    var max = e.total;
    var current = e.loaded;
    var percentComplete = (current * 100) / max;
    console.log(percentComplete);

    document.getElementById("uploadProgressBar").style = `width: ${percentComplete}%`
    document.getElementById("uploadProgressBar").innerHTML = percentComplete + '%';
  
    if (percentComplete >= 100) {
      setTimeout(function() {
        document.getElementById("uploadProgressBar").style.visibility = "hidden";
        $('#previewButton').prop("disabled", false);
        $("#previewButton").html('Preview');
      }, 1500);
    }
  }
}

function getFormattedDate(date) {
  var dateObj = new Date(1900, 0, date);
  
  var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

  var dateString = (month[dateObj.getMonth()]) + "-" + dateObj.getFullYear();
  return dateString;
}
// Action Methods
function didClickOnAddClient() {
  if (numberOfClients === 3) {
    alert("Cannot add more than 3 clients");
    return;
  }
  var rowId = (document.getElementById("clientRow2").innerHTML != "") ? "3" : "2";
  document.getElementById("clientRow" + rowId).style = "margin-top:24px;";
  document.getElementById("clientRow" + rowId).innerHTML = `
  <div class="col-md-3">
  <span class="form-label">Select Client</span>
  <select class="form-control" id="clientSelectControl${rowId}" name="clientSelectControl${rowId}">
  </select>
</div>
<div class="col-md-3">
  <span class="form-label">Select Service</span>
  <select class="form-control" id="serviceSelectControl${rowId}" name="serviceSelectControl${rowId}">
          <option>CRBT</option>
  </select>
</div>
<div class="col-md-3">
  <span class="form-label">Select Origin</span>
  <select class="form-control" id="originSelectControl${rowId}" name="originSelectControl${rowId}">
          <option>International</option>
  </select>
</div>

<div class="col-md-2">
  <button type="button" class="btn btn-danger"
          style="margin-top: 32px;" onclick="didClickOnRemoveClient(${rowId})">Remove</button>
</div>
  `;
  $.each(clients, function (key, value) {
    $(`#clientSelectControl${rowId}`)
      .append($("<option></option>")
        .attr("value", value.client)
        .text(value.client));
  });

  if (rowId == 2) {
    $(document).on('change', '#clientSelectControl2', function () {
      updateServiceControl2($('#clientSelectControl2').val());
    });

    $(document).on('change', '#serviceSelectControl2', function () {
      updateOriginControl2($('#clientSelectControl2').val(), $('#serviceSelectControl2').val());
    });
  } else {
    $(document).on('change', '#clientSelectControl3', function () {
      updateServiceControl3($('#clientSelectControl3').val());
    });

    $(document).on('change', '#serviceSelectControl3', function () {
      updateOriginControl3($('#clientSelectControl3').val(), $('#serviceSelectControl3').val());
    });
  }
  numberOfClients += 1;
}

function didClickOnRemoveClient(rowId) {
  document.getElementById("clientRow" + rowId).innerHTML = "";
  document.getElementById("clientRow" + rowId).style = "";
  numberOfClients -= 1;
}

function didClickOnUploadButton()  {
  var file_data = $('#excel').prop('files')[0];   
  var form_data = new FormData();                  
  form_data.append('file', file_data);
  
  document.getElementById("uploadProgressBar").style = `width: 0%`;
  document.getElementById("uploadProgressBar").innerHTML = '0%';
  document.getElementById("uploadProgressBar").style.visibility = "visible";

  $.ajax({
      url: '/landing/uploadReport', // point to server-side PHP script 
      dataType: 'text',  // what to expect back from the PHP script, if anything
      cache: false,
      contentType: false,
      processData: false,
      data: form_data,                         
      type: 'post',
      headers: {
        authorization: sessionStorage.getItem("token")
      },
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress', progress,false);
        }
        return myXhr;
      },
      success: function(response) {
          parsedReportJson = JSON.parse(response); 
      }
   });
}

function didClickOnPreviewButton() {
  document.getElementById("previewHeaderRow").innerHTML = "";
  document.getElementById("previewTableBody").innerHTML = "";
  $('#previewModal').modal('toggle');
  var records = parsedReportJson.data[2];  
  var maxRecordCount = (records.length > 50) ? 50 : records.length;
  document.getElementById("previewModalTitle").innerHTML = `Showing first ${maxRecordCount} records of uploaded report.`;
  var keys = Object.keys(records[0]);
  for(var i = 0; i< keys.length; i++) {
    document.getElementById("previewHeaderRow").innerHTML += "<th>"+keys[i]+"</th>";
  }
  
  var bodyString = "";
  for(var j = 0; j < maxRecordCount; j++) {
    var record = records[j];
    bodyString  += `<tr>`;
    for(var k = 0; k<keys.length; k++) {
      if(keys[k] === "Month") {
        
        bodyString  += `<td>${getFormattedDate(record[keys[k]] - 1)}</td>`;
      } else {
        bodyString  += `<td>${record[keys[k]]}</td>`;
      } 
    }
    bodyString  += `</tr>`;
  }
  document.getElementById("previewTableBody").innerHTML = bodyString;
}

// On Change Event Listeners
function updateDealsControl(vendor) {
  $('#dealSelectControl').empty();
  var selectedLabel = labels.filter((e) => {
    return e.vendor == vendor;
  });
  var agreements = selectedLabel[0].agreements;
  $.each(agreements, function (key, value) {
    $('#dealSelectControl')
      .append($("<option></option>")
        .attr("value", value.agreementNumber)
        .text(value.deal));
  });
}

function updateServiceControl1(client) {
  $('#serviceSelectControl1').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services;
  $.each(services, function (key, value) {
    $('#serviceSelectControl1')
      .append($("<option></option>")
        .attr("value", value.name)
        .text(value.name));
  });
  //TODO: Should empty the origin control here
}

function updateOriginControl1(client, service) {
  $('#originSelectControl1').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services.filter((e) => {
    return e.name == service;
  });

  var regions = services[0].regionInfo;
  $.each(regions, function (key, value) {
    $('#originSelectControl1')
      .append($("<option></option>")
        .attr("value", value.origin)
        .text(value.origin));
  });
}

function updateServiceControl2(client) {
  $('#serviceSelectControl2').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services;
  $.each(services, function (key, value) {
    $('#serviceSelectControl2')
      .append($("<option></option>")
        .attr("value", value.name)
        .text(value.name));
  });
  //TODO: Should empty the origin control here
}

function updateOriginControl2(client, service) {
  $('#originSelectControl2').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services.filter((e) => {
    return e.name == service;
  });

  var regions = services[0].regionInfo;
  $.each(regions, function (key, value) {
    $('#originSelectControl2')
      .append($("<option></option>")
        .attr("value", value.origin)
        .text(value.origin));
  });
}

function updateServiceControl3(client) {
  $('#serviceSelectControl3').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services;
  $.each(services, function (key, value) {
    $('#serviceSelectControl3')
      .append($("<option></option>")
        .attr("value", value.name)
        .text(value.name));
  });
  //TODO: Should empty the origin control here
}

function updateOriginControl3(client, service) {
  $('#originSelectControl3').empty();
  var selectedClient = clients.filter((e) => {
    return e.client == client;
  });
  var services = selectedClient[0].services.filter((e) => {
    return e.name == service;
  });

  var regions = services[0].regionInfo;
  $.each(regions, function (key, value) {
    $('#originSelectControl3')
      .append($("<option></option>")
        .attr("value", value.origin)
        .text(value.origin));
  });
}