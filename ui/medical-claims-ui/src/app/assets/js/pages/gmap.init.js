/**
 * Theme: T-Wind - Tailwind Admin Dashboard Template
 * Author: Mannatthemes
 * File: Gmaps Js
 */
 basicMap = new GMaps({
    div: '#gmaps-basic',
    lat: -12.043333,
    lng: -77.028333
  });
  
  markerMap = new GMaps({
    div: '#gmaps-marker',
    lat: -12.043333,
    lng: -77.028333
  });
  
  
  markerMap.addMarker({ 
    lat: -12.043333,
    lng: -77.028333,
    title: 'Lima',
    click: function(e) {
      alert('You clicked in this marker');
    }
  });
  
  overlayMap = new GMaps({
    div: '#gmaps-overlay',
    lat: -12.043333,
    lng: -77.028333
  });
  overlayMap.drawOverlay({
    lat: overlayMap.getCenter().lat(),
    lng: overlayMap.getCenter().lng(),
    content: '<div class="overlay">Our Office!<div class="overlay_arrow above"></div></div>',
    verticalAlign: 'top',
    horizontalAlign: 'center'
  });
  
  mapType = new GMaps({
    el: '#gmaps-types',
    lat: -12.043333,
    lng: -77.028333,
    mapTypeControlOptions: {
      mapTypeIds : ["hybrid", "roadmap", "satellite", "terrain", "osm", "cloudmade"]
    }
  });
  mapType.addMapType("osm", {
    getTileUrl: function(coord, zoom) {
      return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "OpenStreetMap",
    maxZoom: 18
  });
  mapType.addMapType("cloudmade", {
    getTileUrl: function(coord, zoom) {
      return "http://b.tile.cloudmade.com/8ee2a50541944fb9bcedded5165f09d9/1/256/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    name: "CloudMade",
    maxZoom: 18
  });
  mapType.setMapTypeId("osm");
  
  
  mapLayers = new GMaps({
    el: "#gmaps-layers",
    lat: -12.043333,
    lng: -77.028333,
    zoom: 3
  });