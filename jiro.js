var map;
var selectedShape;
var drawingManager;

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
    // To show:

  drawingManager.setOptions({
    drawingControl: true
  });
  }
}

function initMap() {
  // Create the map.
  var cebu = {lat: 10.3157, lng: 123.8854};
  map = new google.maps.Map(document.getElementById('map'), {
    center: cebu,
    zoom: 17
  });

  drawingManager = new google.maps.drawing.DrawingManager({
  drawingMode: google.maps.drawing.OverlayType.POLYGON,
  drawingControl: true,
  drawingControlOptions: {
    position: google.maps.ControlPosition.TOP_CENTER,
    drawingModes: ['circle', 'rectangle']
  },

  circleOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.5,
    strokeWeight: 1,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1
  },

  rectangleOptions: {
    fillColor: '#ffff00',
    fillOpacity: 0.5,
    strokeWeight: 1,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1
  }
  });

  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
    if (event.type == google.maps.drawing.OverlayType.CIRCLE) {
      var radius = event.overlay.getRadius();
      alert('CIRCLE');
    }
    else {
      var bounds = event.overlay.getBounds();
      alert('rec');
    }
  });

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
    if (e.type != google.maps.drawing.OverlayType.POLYGON) {
      // Switch back to non-drawing mode after drawing a shape.
      drawingManager.setDrawingMode(null);
      // To hide:
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

  service.nearbySearch(
      {location: cebu, radius: 500, type: ['restaurant']},
      function(results, status, pagination) {
        if (status !== 'OK') return;

        createMarkers(results);
        moreButton.disabled = !pagination.hasNextPage;
        getNextPage = pagination.hasNextPage && function() {
          pagination.nextPage();
        };
      });
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

    var li = document.createElement('li');
    li.textContent = place.name + ' ' + marker.getPosition();
    placesList.appendChild(li);

    bounds.extend(place.geometry.location);
}

  map.fitBounds(bounds);
  google.maps.event.addDomListener(window, 'load', initMap);
  
}

