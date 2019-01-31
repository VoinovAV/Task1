
$( document ).ready(function() {
    $("#submit-button").click(
    function(){
      sendAjaxForm('http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration');
      return false; 
    }
  );
});

//Sending form data function
function sendAjaxForm(url) {
    $.ajax({
        url:    "http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration", //url страницы (action_ajax_form.php)
        type:     "POST", //sending method
        dataType: "html", //data format
        data: $("#register-form").serialize(),  // Form data serializing
        success: function(response) {
          result = $.parseJSON(response);
          //Server answer processing
          if(result.status == "OK"){
            alert(result.message);
            document.location.href = "company.html";
          }
           if(result.status == "Form Error"){
            alert(result.message);
          }
            if(result.status == "Error"){   
            alert(result.message);
          }
        },
        error: function(response) { 
          alert(result.message);
        }
  });
}

//function working with "Companies" server
  window.onload = function() {
    include("https://www.gstatic.com/charts/loader.js");

      google.charts.load('current', {'packages':['corechart']});

      google.charts.setOnLoadCallback(drawChart);

    $.ajax({
        url:    "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList", //url страницы (action_ajax_form.php)
        type:     "POST", //метод отправки
        dataType: "html", //формат данных
        success: function(response) { //Данные отправлены успешно
          result = $.parseJSON(response);
          //count amount of companies
          companiesAmount = result.list.length; 
          //put result into block
          document.getElementById("totalCompaniesAmount").innerHTML= companiesAmount;
          document.getElementById('listOfCompaniesSelect').onchange=function () {
            document.getElementById('block3').style.display="inline-block";
            var myNode = document.getElementById("listOfPartnersSelect");
            while (myNode.firstChild) {
              myNode.removeChild(myNode.firstChild);
            }

            // count partners amount of selected company and create partner blocks in listOfPartnersSelect block
            var partnersAmount = result.list[this.value].partners.length;
            for(i=0;i<=partnersAmount;i++){
              var div = document.createElement('div');
              div.innerHTML = '<div class="partner"><p class="vertical">'+result.list[this.value].partners[i].name+'</p><p class="value">'+result.list[this.value].partners[i].value+"%"+'</p></div>';
              document.getElementById('listOfPartnersSelect').appendChild(div);
            }
          };
          //companies list
          for(i=0;i<=companiesAmount;i++) {
            $('#listOfCompaniesSelect').append($('<option>', {
              value: i,
              id: "company"+i,
              text: result.list[i].name
            }));

          }






        },
        error: function(response) {
          result = $.parseJSON(response);
          alert("Fail");
        }
  });
}


// Google charts function
function drawChart() {
      var jsonData = $.ajax({
        url:    "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList", 
        type:     "POST", 
        dataType: "html",
          async: false,
          success: function(response) { 
          result = $.parseJSON(response);
          
          }
        }).responseText;
      var data = new google.visualization.DataTable(jsonData);
      data.addColumn('string', 'Contry');
      data.addColumn('number', 'Amount');
      var contries = {};
      for (var i = 0; i < result.list.length; ++i) {
        var a = result.list[i].location.name;
        if (contries[a] != undefined)
          ++contries[a];
        else
          contries[a] = 1;
      }
      for (var key in contries){
        data.addRow([key,contries[key]]);
      }      

      var options = {'width':598,
                     'height':298};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('diagramm'));
        // Function opens companies list of selected country on diagramm
        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            document.getElementById('diagramm').style.display="none";
            document.getElementById('listOfContries').style.display="inline-block";
            document.getElementById('backButton').style.display="inline-block";
            document.getElementById('backButton').onclick = function() { 
              document.getElementById('listOfContries').innerHTML="";
              chart.draw(data, options);
              document.getElementById('diagramm').style.display="inline-block";
              document.getElementById('listOfContries').style.display="none";
              document.getElementById('backButton').style.display="none";
            };

            for(i=0;i<=result.list.length;i++) {
              if(result.list[i].location.name==topping){
                $('#listOfContries').append($('<option>', {
                  value: i,
                  id: "companyOfCountry"+i,
                  text: result.list[i].name
                }));
              }
            }


          }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);  

      chart.draw(data, options);
      
}


