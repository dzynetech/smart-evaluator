import Leaflet, { circle, DivIcon, marker } from "leaflet";

const googleStreets = Leaflet.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleHybrid = Leaflet.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleSat = Leaflet.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleTerrain = Leaflet.tileLayer(
  "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const normal = Leaflet.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
);

const baseLayers = {
  Normal: normal,
  Sat: googleSat,
  Hybrid: googleHybrid,
  Terrain: googleTerrain,
};

export function createMapLayers(map) {
  Leaflet.control.layers(baseLayers).addTo(map);
}
