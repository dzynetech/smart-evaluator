//Map._layers not defined in TS, needs to be a JS function
import Leaflet from "leaflet";

export function removeMarkers(map) {
  for (let layer in map._layers) {
    const l = map._layers[layer];
    if (l instanceof Leaflet.Marker) {
      map.removeLayer(l);
    }
  }
}

export function removeGeoJSONs(map) {
  for (let layer in map._layers) {
    const l = map._layers[layer];
    if (l instanceof Leaflet.GeoJSON) {
      map.removeLayer(l);
    }
  }
}