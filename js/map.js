var userMap = new L.Map('mapdiv');
var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/090dcb454ecf48dab1e1765affbbb4ee/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA, Imagery © CloudMade',
    maxZoom: 18
});
var london = new L.LatLng(51.505, -0.09); // geographical point (longitude and latitude)
userMap.setView(london, 13).addLayer(cloudmade);

userMap.on('click', onMapClick);

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}