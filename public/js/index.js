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

  var customMarker = L.icon([latitude, longitude], {
    iconUrl: '../img/marker.png',

    iconSize:     [50, 68], // size of the icon
    iconAnchor:   [25, 68], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -68] // point from which the popup should open relative to the iconAnchor
  }).addTo(map);

  if(text) {
    customMarker.bindPopup(text);
  }

  setTimeout(function() {
    map.removeLayer(customMarker);
  }, pointTimeout);
}

var sse = new ServerSentEvent('events');

sse.on('message', function(message) {
    console.log('message from server:');

    var data = JSON.parse(message);
    console.log(data);

    addPoint(data.geoip.latitude, data.geoip.longitude, data.geoip.city_name);
});
