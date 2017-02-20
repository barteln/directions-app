function getDirections(){

    document.getElementById("directions").innerHTML = "";
    document.getElementById("loader").style.display = "block";

    var key = 'There Was an API Key Here ;)';

    var origin = document.getElementById("origin");
    var destination = document.getElementById("destination");
    var arrival_time = document.getElementById("arrival_time");

    var inputs = document.getElementById("form").getElementsByTagName("input");
    var errSpans = document.getElementById("form").getElementsByTagName("span");

    for(var i = 0; i < inputs.length; i++){
      if(inputs[i].checkValidity() === false){
        errSpans[i].style.display = "inline";
        document.getElementById("loader").style.display = "none";
      }else{
        errSpans[i].style.display = "none";
      }
    }

    if(origin.checkValidity() && arrival_time.checkValidity() && destination.checkValidity()){

      origin = origin.value;
      destination = destination.value
      arrival_time = Math.round(Date.parse(arrival_time.value)/1000);

      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {

              loadData(this);
          }
      };
        xhttp.onloadend = function(){
            document.getElementById("loader").style.display = "none";
        }
      xhttp.open("GET",
                 "https://maps.googleapis.com/maps/api/directions/xml?origin="+origin+"&destination="+destination+"&arrival_time="+arrival_time+"&mode=transit&key="+key, true);
      xhttp.send();
    }
}

function loadData(response){
    var xmlDoc = response.responseXML;
    if(xmlDoc == null){
        document.getElementById("directions").innerHTML += '<p>Invalid response from server</p>';
        return;
    }

    var directions = xmlDoc.getElementsByTagName("step");

    if(directions.length == 0){
        document.getElementById("directions").innerHTML += "<p>Something Went Wrong! Please Change Your Arrival Time and Try Again</p>";
        document.getElementById("loader").style.display = "none";
        return;
    }else{



      var start_address = xmlDoc.getElementsByTagName("start_address")[0].firstChild.nodeValue;
      var end_address = xmlDoc.getElementsByTagName("end_address")[0].firstChild.nodeValue;
      var duration_array = xmlDoc.getElementsByTagName("duration");
      var duration = duration_array[duration_array.length - 1].getElementsByTagName("text")[0].firstChild.nodeValue;

      document.getElementById("directions").innerHTML += "<h3>Results</h3><h4>Total Travel Time: " + duration +" </h4>";

      document.getElementById("directions").innerHTML += "<p><i class='material-icons'>place</i>"+start_address+"</p>";
      for(var i = 0; i < directions.length; i++){
          var direction = directions[i];
          if(direction != null){
              displayDirection(direction, i);
          }
      }
      document.getElementById("directions").innerHTML += "<p><i class='material-icons'>place</i>"+end_address+"</p>";
    }
}

function displayDirection(direction, num){
    if(direction.getElementsByTagName("html_instructions").length !== 0){

      document.getElementById("loader").style.display = "none";

      var html_instructions = direction.getElementsByTagName("html_instructions")[0].firstChild.nodeValue;
      var step_duration = direction.getElementsByTagName("text")[0].firstChild.nodeValue;
      var travel_mode = direction.getElementsByTagName("travel_mode")[0].firstChild.nodeValue;
      var travel_mode_html;

      if(travel_mode === "WALKING"){
        travel_mode_html = "<i class='material-icons'>directions_walk</i>";
      }else if(travel_mode === "TRANSIT"){
        travel_mode_html = "<i class='material-icons'>directions_bus</i>";
      }

      document.getElementById("directions").innerHTML += "<p>" +travel_mode_html + " " + html_instructions + " (about " + step_duration +") </p>";
    }
}
