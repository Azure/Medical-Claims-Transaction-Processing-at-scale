/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Leaflet Js
 */
 var mymap = L.map('Leaf_default').setView([51.505, -0.09], 13);

 L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
     maxZoom: 18,
     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
         '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
         'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     id: 'mapbox/streets-v11'
 }).addTo(mymap);

 L.marker([51.5, -0.09]).addTo(mymap)
     .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

 L.circle([51.508, -0.11], 500, {
     color: 'red',
     fillColor: '#f03',
     fillOpacity: 0.5
 }).addTo(mymap).bindPopup("I am a circle.");

 L.polygon([
     [51.509, -0.08],
     [51.503, -0.06],
     [51.51, -0.047]
 ]).addTo(mymap).bindPopup("I am a polygon.");


 var popup = L.popup();

 function onMapClick(e) {
     popup
         .setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(mymap);
 }

 mymap.on('click', onMapClick);


 //  Map -2

 var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
 osm = new L.TileLayer(osmUrl, {maxZoom: 18});

 var latLng = new L.LatLng(54.18815548107151, -7.657470703124999);

 var bounds1 = new L.LatLngBounds(new L.LatLng(54.559322, -5.767822), new L.LatLng(56.1210604, -3.021240));
 var bounds2 = new L.LatLngBounds(new L.LatLng(56.56023925701561, -2.076416015625), new L.LatLng(57.01158038001565, -0.9777832031250001));
 var bounds3;

 var map = new L.Map('Bounds_Extend', {
     layers: [osm],
     center: bounds1.getCenter(),
     zoom: 7
 });

 var rectangle1 = new L.Rectangle(bounds1);
 var rectangle2 = new L.Rectangle(bounds2);
 var rectangle3;

 var marker = new L.Marker(latLng);

 map.addLayer(rectangle1).addLayer(rectangle2).addLayer(marker);





 function boundsExtendBounds() {
     if  (rectangle3) {
         map.removeLayer(rectangle3);
         rectangle3 = null;
     }
     if (bounds3) {
         bounds3 = null;
     }
     bounds3 = new L.LatLngBounds(bounds1.getSouthWest(), bounds1.getNorthEast());
     bounds3.extend(bounds2);
     rectangle3 = new L.Rectangle(bounds3, {
         color: "#ff0000",
         weight: 1,
         opacity: 1,
         fillOpacity: 0
     });

     map.addLayer(rectangle3);
 }

 function boundsExtendLatLng() {
     if  (rectangle3) {
         map.removeLayer(rectangle3);
         rectangle3 = null;
     }
     if (bounds3) {
         bounds3 = null;
     }
     bounds3 = new L.LatLngBounds(bounds1.getSouthWest(), bounds1.getNorthEast());
     bounds3.extend(marker.getLatLng());
     rectangle3 = new L.Rectangle(bounds3, {
         color: "#ff0000",
         weight: 1,
         opacity: 1,
         fillOpacity: 0
     });

     map.addLayer(rectangle3);
 }

// Map-3


var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

     var poly_points = [
         [39.70348880963439, -104.98603820800781],
         [39.69926245589766, -104.95582580566406],
         [39.67918374111695, -104.94483947753906],
         [39.663856582926165, -104.95307922363281],
         [39.66279941218785, -104.98672485351562],
         [39.70348880963439, -104.98603820800781]
     ];

     var path_points = [
         [39.72567292003209, -104.98672485351562],
         [39.717222671644635, -104.96612548828124],
         [39.71405356154611, -104.95513916015625],
         [39.70982785491674, -104.94758605957031],
         [39.70454535762547, -104.93247985839844],
         [39.696092520737224, -104.91874694824217],
         [39.687638648548635, -104.90432739257812],
         [39.67759833072648, -104.89471435546875]
     ];

     for (var i = 0, latlngs = [], len = path_points.length; i < len; i++) {
         latlngs.push(new L.LatLng(path_points[i][0], path_points[i][1]));
     }
     var path = new L.Polyline(latlngs);

     for (var i = 0, latlngs2 = [], len = poly_points.length; i < len; i++) {
         latlngs2.push(new L.LatLng(poly_points[i][0], poly_points[i][1]));
     }
     var poly = new L.Polygon(latlngs2);

     var map = new L.Map('Vector_bounds', {
         layers: [osm],
         center: new L.LatLng(39.69596043694606, -104.95084762573242),
         zoom: 12
     });

     //map.fitBounds(new L.LatLngBounds(latlngs));

     //map.addLayer(new L.Marker(latlngs[0]));
     //map.addLayer(new L.Marker(latlngs[len - 1]));

     map.addLayer(path);
     map.addLayer(poly);

     path.bindPopup("Hello world");
     
     // Map-4


     var osmUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
         osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

     var map = L.map('Moov_Canvas', {preferCanvas: true})
             .setView([50.5, 30.51], 15)
             .addLayer(osm);

     var markers = [];
     var colors = ['red', 'green', 'blue', 'purple', 'cyan', 'yellow'];
     for (var i = 0; i < 20; i++) {
         markers.push(L.circleMarker([50.5, 30.51], {color: colors[i % colors.length]}).addTo(map));
     }

     function update() {
         var t = new Date().getTime() / 1000;
         markers.forEach(function(marker, i) {
             var v = t * (1 + i / 10) + (12.5 * i) / 180 * Math.PI;
             marker.setLatLng([
                 50.5 + (i % 2 ? 1 : -1) * Math.sin(v) * 0.005,
                 30.51 + (i % 3 ? 1 : -1) * Math.cos(v) * 0.005,
                 ]);
         });

         L.Util.requestAnimFrame(update);
     }

     update();
     
     // Map-5


     var map = L.map('Array_Map', {
         center: [20, 20],
         zoom: 3,
         preferCanvas: true
     });
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         minZoom: 1,
         maxZoom: 17,
         label: 'open street map'
     }).addTo(map);
     var points = [
                     [0, 0],
                     [0, 42],
                     [42, 42],
                     [0, 0]
             ];
             L.polygon([points, []], {dashArray: '5, 5'}).addTo(map);
             L.circleMarker([42, 0], {color: 'red'}).addTo(map);


             // Map-6


             var map = L.map('V_Simple');
     
     map.setView([51.505, -0.09], 13);

     var marker = L.marker([51.5, -0.09])
         .bindPopup("<b>Hello world!</b><br />I am a popup.")
         .addTo(map);

     var circle = L.circle([51.508, -0.11], 500, {color: '#f03', opacity: 0.7})
         .bindPopup("I am a circle.")
         .addTo(map);

     var polygon = L.polygon([
         [51.509, -0.08],
         [51.503, -0.06],
         [51.51,  -0.047]])
         .bindPopup("I am a polygon.")
         .addTo(map);

     var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
         osmAttrib = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib}).addTo(map);
 