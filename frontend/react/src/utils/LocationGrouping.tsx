import Leaflet, { LatLngExpression, Marker } from "leaflet";
import { Permit } from "../generated/graphql";

interface Location {
  id: number;
  x: number;
  y: number;
  color?: string;
}

export interface MarkerObj {
  x: number;
  y: number;
  ids: number[];
  r: number;
  active: boolean;
  color?: string;
}

function metersPerPixel(zoom: number, lat: number) {
  return (
    (40075016.686 * Math.abs(Math.cos((lat * Math.PI) / 180))) /
    Math.pow(2, zoom + 8)
  );
}

//meters
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
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

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function individualMarkers(
  locations: Location[],
  activePermit: Permit | null
): MarkerObj[] {
  const markers: MarkerObj[] = [];
  for (const l of locations) {
    if (l.id == activePermit?.id) {
      continue;
    }
    let marker: MarkerObj = {
      x: l.x,
      y: l.y,
      r: 12,
      ids: [l.id],
      active: false,
      color: l.color,
    };
    markers.push(marker);
  }
  return markers;
}

export function computeMarkers(
  zoom: number,
  lat: number,
  locations: Location[],
  activePermit: Permit | null
): MarkerObj[] {
  const maxDistance = metersPerPixel(zoom, lat) * 40;
  var doneIds: number[] = [];
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
    let marker: MarkerObj = {
      x: avgX,
      y: avgY,
      r: Math.max(diameter / 2, 12),
      ids: thisMarkerLocs.map((x) => x.id),
      active: active,
    };
    if (active && marker.ids.length === 1) {
      //dont render just active permit alone, star already does that
      continue;
    }
    markers.push(marker);
  }
  return markers;
  //return  array of: {x: y: r: ids:[]}
}

export function circleWithText(
  latLng: LatLngExpression,
  txt: string,
  radius: number,
  color?: string
) {
  var size = radius * 2;
  var style = `width: ${size}px; height: ${size}px;`;
  if (color) {
    style += `border-color:${color}`;
  }
  var iconSize = size + 4;
  var icon = Leaflet.divIcon({
    html: `<span class="circle" style="${style}">${txt}</span>`,
    className: "",
    iconSize: [iconSize, iconSize],
  });
  var marker = Leaflet.marker(latLng, {
    icon: icon,
  });
  return marker;
}
