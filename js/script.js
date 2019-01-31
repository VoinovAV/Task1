$( document ).ready(function() {
    $("#submit-button").click(
    function(){
      sendAjaxForm('http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration');
      return false; 
    }
  );
});
 
function sendAjaxForm(url) {
    $.ajax({
        url:    "http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration", //url страницы (action_ajax_form.php)
        type:     "POST", //метод отправки
        dataType: "html", //формат данных
        data: $("#register-form").serialize(),  // Сеарилизуем объект
        success: function(response) { //Данные отправлены успешно
          result = $.parseJSON(response);
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
        error: function(response) { // Данные не отправлены
          alert(result.message);
        }
  });
}


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
          companiesAmount = result.list.length; 
          document.getElementById("totalCompaniesAmount").innerHTML= companiesAmount;
          document.getElementById('listOfCompaniesSelect').onchange=function () {
            document.getElementById('block3').style.display="inline-block";
            var myNode = document.getElementById("listOfPartnersSelect");
            while (myNode.firstChild) {
              myNode.removeChild(myNode.firstChild);
            }
            var partnersAmount = result.list[this.value].partners.length;
            for(i=0;i<=partnersAmount;i++){
              var div = document.createElement('div');
              div.innerHTML = '<div class="partner"><p class="vertical">'+result.list[this.value].partners[i].name+'</p><p class="value">'+result.list[this.value].partners[i].value+"%"+'</p></div>';
              document.getElementById('listOfPartnersSelect').appendChild(div);
            }
          };

          for(i=0;i<=companiesAmount;i++) {
            $('#listOfCompaniesSelect').append($('<option>', {
              value: i,
              id: "company"+i,
              text: result.list[i].name
            }));

          }






        },
        error: function(response) { // Данные не отправлены
          result = $.parseJSON(response);
          alert("Fail");
        }
  });
}


function include(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }


function drawChart() {
      var jsonData = $.ajax({
        url:    "http://codeit.pro/codeitCandidates/serverFrontendTest/company/getList", //url страницы (action_ajax_form.php)
        type:     "POST", //метод отправки
        dataType: "html", //формат данных
          async: false,
          success: function(response) { //Данные отправлены успешно
          result = $.parseJSON(response);
          
          }
        }).responseText;
      var data = new google.visualization.DataTable(jsonData);
      data.addColumn('string', 'Contry');
      data.addColumn('number', 'Amount');
      //alert(result.list[1].partners.length);
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

        function selectHandler() {
          var selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            var topping = data.getValue(selectedItem.row, 0);
            //alert('The user selected ' + topping);
            document.getElementById('diagramm').style.display="none";
            document.getElementById('listOfContries').style.display="inline-block";
            document.getElementById('backButton').style.display="inline-block";
            document.getElementById('backButton').onclick = function() { // перезапишет существующий обработчик
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


