//Store JSON in Query URL (USGS JSON data) 
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//d3 json to get data // possibly need to do d3.json.then
d3.json(queryURL, function(data) {
    //send data.features to create features
   createFeatures(data.features);
});
// Define the function that will run for each feature
    // Give each feature a popup describing the place and time of the earthquake. ?
function createFeatures(earthquakeData) {
        function onEachFeauture(feature, layer){
            layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + Date(feature.properties.time) + "</p>");

}
//create GeoJson layer
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
  });
// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define satellite, outdoors, and grayscale layers.
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers.
    var baseMaps = {
      "Street Map": streetmap,
      "Lightmap" : lightmap
    };
  
    // Create overlay object to hold our overlay layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // dDefine map object and making it display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Set up the legend.
    var legend = L.control({ 
        position: 'bottomright'
    });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend');
        var magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML = "<div style='background-color:white; padding: .5em;'><h4 style='background-color:white; padding:.5em'>Magnitude</h4><ul>";
//Creat Legend
        for (var i = 0; i < magnitude.length; i++) {
             div.innerHTML += 
             '<li style=\"list-style:none; padding:.5em; background-color:' + getColor(magnitude[i] + 1) + ';\"> '+ 
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+')
                "</li>";
        }
       div.innerHTML += "</ul></div>"; 

        return div;
    };

    // Adding legend to the map.
    legend.addTo(myMap);
}


