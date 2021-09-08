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

export function computeMarkers(zoom, lat, locations) {
  // console.log(locations);
  //locations: {id,x,y}
  const maxDistance = metersPerPixel(zoom, lat) * 40;
  var doneIds = [];
  var markers = [];
  for (let location of locations) {
    if (doneIds.includes(location.id)) {
      continue;
    }
    doneIds.push(location.id);
    var thisMarkerIds = [location.id];
    for (var i = 0; i < locations.length; i++) {
      if (
        !doneIds.includes(i) &&
        location.id != locations[i].id &&
        haversineDistance(
          location.y,
          location.x,
          locations[i].y,
          locations[i].x
        ) < maxDistance
      ) {
        //combine these two
        doneIds.push(locations[i].id);
        thisMarkerIds.push(locations[i].id);
      }
    }
    //TODO: take the avg point for the marker location
    let marker = {
      x: location.x,
      y: location.y,
      r: 10 + 3 * thisMarkerIds.length,
      ids: thisMarkerIds,
    };
    markers.push(marker);
  }
  console.log(markers);
  return markers;
  //return  array of: {x: y: r: ids:[]}
}
