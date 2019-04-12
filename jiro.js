var map;
var selectedShape;
var drawingManager;
var infowindow;
var markers = [];



function initMap() {
  // Create the map.
  var cebu = {lat: 10.3157, lng: 123.8854};
  map = new google.maps.Map(document.getElementById('map'), {
    center: cebu,
    zoom: 20
  });

  var cebu_marker = new google.maps.Marker({
          position: cebu,
          map: map
  });

  draw.onclick = function () {
    drawingManager.setMap(map);
    draw.disabled = true;
  }

  drawingManager = new google.maps.drawing.DrawingManager({
  drawingMode: 'circle',
  drawingControl: true,
  drawingControlOptions: {
    position: google.maps.ControlPosition.TOP_CENTER,
    drawingModes: ['circle', 'rectangle']
  },

  circleOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.5,
    strokeWeight: 0,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1
  },

  rectangleOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.5,
    strokeWeight: 0,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1
  }
  });


  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
    if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
      var radius = event.overlay.getRadius();
      var center = event.overlay.getCenter();
     

      var IDs=[];
      for(var k in markers){
        if(google.maps.geometry.spherical.computeDistanceBetween(center,markers[k].getPosition())<=radius){
          IDs.push(k);
          markers[k].setMap(map);
          console.log(markers[k].title, markers[k].position);
        }
     
      }
      var matches = "Found " + IDs.length.toString() + " restaurant(s)";
      infowindow = new google.maps.InfoWindow({
        content: matches,
        position: center,

      });

      infowindow.open(map);
      infowindow.addListener('closeclick', deleteSelectedShape);
    }
    // for rectangle
    else {
      var bounds = event.overlay.getBounds()
      clearMap();
    }
  });

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
    if (e.type != google.maps.drawing.OverlayType.POLYGON) {
      drawingManager.setDrawingMode(null);
      drawingManager.setOptions({
        drawingControl: false
      });
      var newShape = e.overlay;
      newShape.type = e.type;
      google.maps.event.addListener(newShape, 'click', function() {
        setSelection(newShape);
      });
      setSelection(newShape);
    }
  });

  google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
  google.maps.event.addListener(map, 'click', clearSelection);
  google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
  

  var service = new google.maps.places.PlacesService(map);
  var getNextPage = null;
  var moreButton = document.getElementById('more');
  moreButton.onclick = function() {
    moreButton.disabled = true;
    if (getNextPage) getNextPage();
  };



/*  // default markers when map loads
  service.nearbySearch(
  {location: cebu, radius: 500, type: ['restaurant']},
  function(results, status, pagination) {
    if (status !== 'OK') return;
    createMarkers(results);
    moreButton.disabled = !pagination.hasNextPage;
    getNextPage = pagination.hasNextPage && function() {
    pagination.nextPage();

    };
  });*/


  
  // for dropdown menu
  var nearbyRequest = {location: cebu, radius: 500, type: ['restaurant']};
  var dropdown = document.getElementById('cuisine');

  

  dropdown.onchange = function() {
    
    clearMap();
    markers = [];
    cuisine = document.getElementById("cuisine").value 
    if (cuisine == 'all') {
      nearbyRequest = {location: cebu, radius: 500, type: ['restaurant']};
    }
    else {
      nearbyRequest = {location: cebu, radius: 500, keyword: cuisine, type: ['restaurant']};
    }

    service.nearbySearch(
      nearbyRequest,
      function(results, status, pagination) {
        if (status !== 'OK') return;
        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
        pagination.nextPage();
        };
      });
  };

  //


}


function createMarkers(places) {
  
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('places');
  
  for (var i = 0, place; place = places[i]; i++) {

    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: place.name,
      position: place.geometry.location
    });

    //assign listeners to marker
    marker.addListener('click', (
      function(marker, i) {
        return function() {
          alert(marker.title);                    
        }
      })
    (marker, i));

    markers.push(marker);

    var li = document.createElement('li');
    li.textContent = place.name
    placesList.appendChild(li);
    bounds.extend(place.geometry.location);
    
  }
  map.fitBounds(bounds);
  google.maps.event.addDomListener(window, 'load', initMap);
}

function clearSelection() {
  if (selectedShape) {
    selectedShape.setEditable(false);
    selectedShape = null;
  }
}

function setSelection(shape) {
  clearSelection();
  selectedShape = shape;
  shape.setEditable(false);
}

function deleteSelectedShape() {
  if (selectedShape) {
    selectedShape.setMap(null);
    drawingManager.setOptions({
    drawingControl: true
    });
    infowindow.close();
  }

}

function clearMap() {
  document.getElementById("places").innerHTML = "";
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

}
