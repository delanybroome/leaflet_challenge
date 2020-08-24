// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 8
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);


//Query URL (USGS JSON data)
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//d3 json to get data // possibly need to do d3.json.then
d3.json(queryUrl, function(data) {
     //send data.features to create features
    createFeatures(data);
   
});
// size of marker - make different based on magnitude 
function markerSize(magnitude) {
    return (magnitude +1 ) * 2.5; 
}
//determine colors to reflect magnitude of earthquake 
function getColor(mag) {
    if (mag >5) {
        return "Purple";
    }
    if (mag > 4) {
        return "Red";
    }
    if (mag >3) {
        return "Orange"
    }
    if (mag > 1) {
        return "Yellow";
    } 
    //default: 
    //return "Green";
}

function createFeatures(earthquakeData) {
    //Style of Marker  !!!!!!!! I keep getting an error here 
    function styleInfo(feature) {
        return {
            opacity: .75, 
            fill0pacity: .75,
            fillColor: getColor(feature.properties.mag),
            color: "black",
            radius: markerSize(feature.properties.mag),
            stroke: true, 
            weight: 0.75
        };
    }
}
  // Define the function that will run for each feature
    // Give each feature a popup describing the place and time of the earthquake. ?
    function onEachFeature(feature, layer) {
        layer.bindPopup(


      // Create a GeoJSON layer containing the features array on the earthquakeData object.
      // Run the onEachFeature function once for each piece of data in the array
      let earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
          pointToLayer: function(feature, latlong) {
              return L.circleMarker(latlong);
          },
          style:styleInfo
      });
    
      // Sending our earthquakes layer to the createMap function.
      createMap(earthquakes);
  };
  
  function createMap(earthquakes) {
  
      // Set up the legend.
      var legend = L.tile({ position: 'bottomright' });
  
      legend.onAdd = function () {
  
          var div = L.DomUtil.create('div', 'info legend');
          var magnitude = [0, 1, 2, 3, 4, 5],
              labels = [];
  
          div.innerHTML = "<div style='background-color:white; padding: .5em;'><h4 style='background-color:white; padding:.5em'>Magnitude</h4><ul>";
  
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