//Create Base Map

// Define a baseMaps object to hold our base layers.
var baseMaps = {
  "Satellite": satellite,
  "Outdoors": outdoors,
  "Grayscale" : lightmap
};

// Create overlay object to hold our overlay layer.
var overlayMaps = {
  Earthquakes: earthquakes
};

// Create our map, giving it the lightmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 4,
  layers: [lightmap, earthquakes]
});

// Create a tile layor
// Pass in our baseMaps and overlayMaps
// Add the tile layor to the map
L.tile.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);



//Query URL 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

//d3 json to get data
d3.json(queryUrl, function(data) {
     //send data.features to create features
    createFeatures(data);
   
});
// size of marker 
function markerSize(magnitude) {
    return (magnitude +1 ) * 2.5; 
}
//determine colors to reflect magnitude of earthquake 
function getColor(mag) {
    if (mag >5) {
        return "Purple";
    }
    if (mag > 4) {
        return "FireBrick";
    }
    if (mag >3) {
        return "Orange"
    }
    if (mag > 1) {
        return "Yellow";
    } 
    return "Green";
}

function createFeatures(earthquakeData) {
    //Style of Marker  !!!!!!!! I keep getting an error here 
    function styleInfo(feature) {
        return {
            opacity: .75, 
            fill0pacity: .75,
            fillColor: getColor(feature.properties.mag),
            color: "black"
            radius: markerSize(feature.properties.mag)
            stroke: true, 
            weight: 0.75
        };
    }
}
  // Define the function that will run for each feature
    // Give each feature a popup describing the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + Date(feature.properties.time) + "</p>");
      }
    
      // Create a GeoJSON layer containing the features array on the earthquakeData object.
      // Run the onEachFeature function once for each piece of data in the array
      var earthquakes = L.geoJSON(earthquakeData, {
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