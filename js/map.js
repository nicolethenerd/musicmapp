var userMap = new L.Map('mapdiv');
var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/090dcb454ecf48dab1e1765affbbb4ee/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA, Imagery © CloudMade',
    maxZoom: 18
});
var london = new L.LatLng(51.505, -0.09); // geographical point (longitude and latitude)
userMap.setView(london, 13).addLayer(cloudmade);

var geojsonLayer = new L.GeoJSON();

geojsonLayer.on("featureparse", function (e) {
    if (e.properties && e.properties.popupContent){
        e.layer.bindPopup(e.properties.popupContent);
    }
});

$.getJSON(
        "sp://radiomap/js/world.json",
        function(geojson) {
        $.each(geojson.features, function(i, feature) {
          geojsonLayer.addGeoJSON(feature);
          console.log(feature);
        })
    });

userMap.addLayer(geojsonLayer);
