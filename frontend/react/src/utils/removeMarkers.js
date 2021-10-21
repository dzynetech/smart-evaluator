//Map._layers not defined in TS, needs to be a JS function
import Leaflet from "leaflet";

function removeOldMarkers(map) {
  for (let layer in map._layers) {
    const l = map._layers[layer];
    if (l instanceof Leaflet.Marker) {
      map.removeLayer(l);
    }
  }
}

export default removeOldMarkers;
