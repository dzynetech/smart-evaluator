import React, { useState, useEffect, useRef } from "react";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import { useLocation } from "react-router";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { computeMarkers, circleWithText } from "../utils/LocationGrouping";
import { createMapLayers } from "../utils/MapLayers";
import "leaflet.heat";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import ALL_PERMITS_QUERY from "../queries/AllPermitsQuery";

window.locs = [];
window.showMarkers = true;

function Map(props) {
  const [getPermits, { error, data }] = useLazyQuery(ALL_PERMITS_QUERY);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatLayer, setHeatLayer] = useState(null);

  const apolloClient = useApolloClient();
  if (error) console.log(error);

  const map = useMapEvent("zoomend", updateMarkers);
  useEffect(() => {
    createMapLayers(map);
  }, []);

  function removeOldMarkers() {
    for (let layer in map._layers) {
      const l = map._layers[layer];
      if (l instanceof Leaflet.Marker) {
        map.removeLayer(l);
      }
    }
  }

  function updateMarkers() {
    if (!window.showMarkers) {
      return;
    }
    props.setZoomTarget(null);
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    const markerLocations = computeMarkers(
      zoom,
      lat,
      window.locs,
      window.activePermit
    );
    removeOldMarkers();
    props.setPermitForModal(null);
    for (let m of markerLocations) {
      const marker = circleWithText([m.y, m.x], m.ids.length, m.r, 2, m.active);
      if (m.ids.length === 1) {
        marker.on("mouseover", (e) => {
          props.setPermitForModal({
            id: m.ids[0],
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: true,
          });
        });
        marker.on("mouseout", (e) => {
          props.setPermitForModal({
            id: m.ids[0],
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: false,
          });
        });
      }
      marker.addTo(map);
    }
  }

  if (props.zoomTarget) {
    map.flyTo([props.zoomTarget.y, props.zoomTarget.x], 16, {
      duration: 0.6,
    });
  }

  const router_location = useLocation();

  useEffect(() => {
    if (!props.filterVars) {
      return;
    }
    getPermits({ variables: props.filterVars });
  }, [props.filterVars]);

  useEffect(() => {
    if (data) {
      var locs = [];
      data.permits.edges.forEach((p) => {
        locs.push({
          id: p.node.id,
          x: p.node.location.x,
          y: p.node.location.y,
        });
      });
      window.locs = locs;

      //setup heatmap
      if (showHeatmap) {
        var heatmap_data = [];
        window.locs.forEach((l) => {
          heatmap_data.push([l.y, l.x, 7]);
        });
        const heat = Leaflet.heatLayer(heatmap_data, { radius: 25 });
        heat.addTo(map);
        setHeatLayer(heat);
      }
    }
  }, [data]);

  //enable disable heatmap
  useEffect(() => {
    if (showHeatmap && window.locs.length > 0) {
      var heatmap_data = [];
      window.locs.forEach((l) => {
        heatmap_data.push([l.y, l.x, 7]);
      });
      const heat = Leaflet.heatLayer(heatmap_data, { radius: 25 });
      heat.addTo(map);
      setHeatLayer(heat);
    }
    if (!showHeatmap && heatLayer) {
      map.removeLayer(heatLayer);
      setHeatLayer(null);
    }
  }, [showHeatmap]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (showMarkers) {
      window.showMarkers = true;
      updateMarkers();
    }
    if (!showMarkers) {
      window.showMarkers = false;
      removeOldMarkers();
    }
  }, [showMarkers]);

  useEffect(() => {
    if (data && map) {
      var bounds = data.permits.edges.map((p) => [
        p.node.location.y,
        p.node.location.x,
      ]);
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
      updateMarkers();
    }
  }, [data]);

  return (
    <>
      <div>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        <div id="map-controls" className="leaflet-bottom leaflet-right">
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowMarkers((x) => !x)}
          >
            markers
          </button>
          <button
            className="btn btn-sm btn-light"
            onClick={(e) => {
              setShowHeatmap((x) => !x);
            }}
          >
            heatmap
          </button>
        </div>
      </div>
    </>
  );
}

export default Map;
