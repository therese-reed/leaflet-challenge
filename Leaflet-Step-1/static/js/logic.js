// create the base map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

// add the light layer tile 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.light",
accessToken: API_KEY
}).addTo(myMap);


// get the url for the earthquake data
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=" +
"2019-01-02&maxlongitude=170.52148437&minlongitude=-150.83789062&maxlatitude=80.74894534&minlatitude=-85.16517337";

// create a function that changes marker size depending on the magnitute values
function markerSize(mag){
    return mag * 5
}

// create a function that gets colors for circle markers
function getColors(d) {
  if (d < 1){
    return "#B7DF5F"
  }
  else if ( d < 2){
    return "#DCED11"
  }
  else if (d < 3){
    return "#EDD911"
  }
  else if (d < 4){
    return "#EDB411"
  }
  else if (d < 5 ){
    return "#ED7211"
  }
  else {
    return "#ED4311"
  }
};

// create a function that creates markers
function createCircleMarker(feature, latlng ){

// Change the values of these options to change the symbol's appearance
  var markerOptions = {
    radius: markerSize(feature.properties.mag),
    fillColor: getColors(feature.properties.mag),
    color: "black",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
  return L.circleMarker( latlng, markerOptions );
};
  
// Use json request to fetch the data from a URL
d3.json(queryUrl, function(data) {

  console.log(data)

  var earthquakes = data.features

  console.log(earthquakes)
  
  // loop through the data to create markers and popup
  earthquakes.forEach(function(result){
    //console.log(result.properties)
    L.geoJSON(result,{
      pointToLayer: createCircleMarker
      // add popups to the circle markers to display data
    }).bindPopup("Date: " + new Date(result.properties.time) + "<br>Place: " + result.properties.place + "<br>Magnitude: " + result.properties.mag).addTo(myMap)
  });

  //create legennds and add to the map
  var legend = L.control({position: "bottomright" });
  legend.onAdd = function(){
    // create div for the legend
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5]
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColors(grades[i]) + '"></i> ' +
            grades[i] + (grades[i +1 ] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});
