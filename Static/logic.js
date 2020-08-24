//Query URL 
var queryUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"

//d3 json to get data
d3.json(queryUrl, function(data) {
     //send data.features to create features
    createFeatures(data);
   
});
// size of marker 
function markerSize(magnitude) {
    return (magnitude +1 ) * 2.5; 
}
