// settings
var pointTimeout = 30000;
var zoom = 5;
var center = [39.64, -98.086];

// Setup map
var map = L.map('map').setView(center, zoom);

L.tileLayer('http://{s}.tiles.mapbox.com/v3/pretio.jhgjhh79/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    minZoom: zoom, maxZoom: zoom
}).addTo(map);

function addPoint(latitude, longitude, text) {
  var circle = L.circleMarker([latitude, longitude], {
    radius: 10,
    color: 'green',
    fillColor: 'lightgreen',
    fillOpacity: 0.3
  }).addTo(map);

  if(text) {
    circle.bindPopup(text);
  }

  setTimeout(function() {
    map.removeLayer(circle);
  }, pointTimeout);
}

var sse = new ServerSentEvent('events');

sse.on('message', function(message) {
    console.log('message from server:');

    var data = JSON.parse(message);
    console.log(data);

    addPoint(data.geoip.latitude, data.geoip.longitude, data.geoip.city_name);
});
