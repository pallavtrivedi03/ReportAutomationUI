// Global Variables
var clients;
var labels;
var numberOfClients = 1;

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