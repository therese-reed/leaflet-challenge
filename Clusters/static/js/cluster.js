// create the base map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3
  });

// get the queryurl 
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-08-01&endtime=" +
 "2019-08-10&maxlongitude=175.52148437&minlongitude=-170.83789062&maxlatitude=80.74894534&minlatitude=-85.7433195";
 
// get the light tile layer
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// read the data
d3.json(queryUrl, function(data){

    console.log(data);
    // create the location variable
    var location = data.features;

    console.log(location)
    // create the markers
    var markers = L.markerClusterGroup();

    //loop throug location array to get lat and long info for markers
    location.forEach(function(result){

        var lat = result.geometry.coordinates[1];
        var long = result.geometry.coordinates[0];
        var place = result.properties.place
        //console.log(place)
        
        // add markers to the layer and add the popup
        markers.addLayer(L.marker([lat, long]).bindPopup(place));

    })
  
    // add markers layer to the map
    myMap.addLayer(markers);
})