import Leaflet from "leaflet";

function metersPerPixel(zoom, lat) {
  return (
    (40075016.686 * Math.abs(Math.cos((lat * Math.PI) / 180))) /
    Math.pow(2, zoom + 8)
  );
}

//meters
function haversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // distance in km
  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export function computeMarkers(zoom, lat, locations, activePermit) {
  // console.log(locations);
  //locations: {id,x,y}
  console.log(activePermit);
  const maxDistance = metersPerPixel(zoom, lat) * 40;
  var doneIds = [];
  var markers = [];
  for (let location of locations) {
    if (doneIds.includes(location.id)) {
      continue;
    }
    var active = location.id === activePermit?.id;
    doneIds.push(location.id);
    var thisMarkerLocs = [location];
    for (var i = 0; i < locations.length; i++) {
      if (
        !doneIds.includes(locations[i].id) &&
        location.id !== locations[i].id &&
        haversineDistance(
          location.y,
          location.x,
          locations[i].y,
          locations[i].x
        ) < maxDistance
      ) {
        //combine these two
        doneIds.push(locations[i].id);
        active = active || locations[i].id === activePermit?.id;
        thisMarkerLocs.push(locations[i]);
      }
    }
    //take the avg point for the marker location
    const avgX =
      thisMarkerLocs.reduce((prev, curr) => prev + curr.x, 0) /
      thisMarkerLocs.length;
    const avgY =
      thisMarkerLocs.reduce((prev, curr) => prev + curr.y, 0) /
      thisMarkerLocs.length;
    // get the size of the circle by computing furthest locations
    const minY = thisMarkerLocs.reduce(
      (prev, curr) => Math.min(prev, curr.y),
      thisMarkerLocs[0].y
    );
    const minX = thisMarkerLocs.reduce(
      (prev, curr) => Math.min(prev, curr.x),
      thisMarkerLocs[0].x
    );
    const maxY = thisMarkerLocs.reduce(
      (prev, curr) => Math.max(prev, curr.y),
      thisMarkerLocs[0].y
    );
    const maxX = thisMarkerLocs.reduce(
      (prev, curr) => Math.max(prev, curr.x),
      thisMarkerLocs[0].x
    );
    const dist = haversineDistance(minY, minX, maxY, maxX);
    const diameter = (1 / metersPerPixel(zoom, lat)) * dist;
    let marker = {
      x: avgX,
      y: avgY,
      r: Math.max(diameter / 2, 12),
      ids: thisMarkerLocs.map((x) => x.id),
      active: active,
    };
    markers.push(marker);
  }
  return markers;
  //return  array of: {x: y: r: ids:[]}
}

export function circleWithText(latLng, txt, radius, borderWidth, active) {
  const extraClass = active ? "activeMarker" : "";
  var size = radius * 2;
  var style =
    'style="width: ' +
    size +
    "px; height: " +
    size +
    "px; border-width: " +
    borderWidth +
    'px;"';
  var iconSize = size + borderWidth * 2;
  var icon = Leaflet.divIcon({
    html:
      '<span class="' +
      "circle " +
      extraClass +
      '" ' +
      style +
      ">" +
      txt +
      "</span>",
    className: "",
    iconSize: [iconSize, iconSize],
  });
  var marker = Leaflet.marker(latLng, {
    icon: icon,
  });
  return marker;
}
