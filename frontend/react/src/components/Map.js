import React, { useState, useEffect, useRef } from "react";
import Leaflet from "leaflet";
import { useLazyQuery } from "@apollo/client";
import { computeMarkers, circleWithText } from "../utils/LocationGrouping";
import { createMapLayers } from "../utils/MapLayers";
import useMap from "../components/dzyne_components/hooks/useMap";
import "../HeatLayer";

import "leaflet/dist/leaflet.css";
import ALL_PERMITS_QUERY from "../queries/AllPermitsQuery";

function Map(props) {
  const [getPermits, { error, data }] = useLazyQuery(ALL_PERMITS_QUERY);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatLayer, setHeatLayer] = useState(null);
  const [locations, setLocations] = useState([]);
  const zoomCallbackRef = useRef();

  if (error) console.log(error);

  const map = useMap("map", {}, {}, (map) => {
    createMapLayers(map);
  });

  //keep reclustering on zoom from becoming stale
  useEffect(() => {
    if (!map) {
      return;
    }
    if (zoomCallbackRef.current) {
      map.off("zoomend", zoomCallbackRef.current);
    }
    zoomCallbackRef.current = updateMarkers;
    map.on("zoomend", zoomCallbackRef.current);
    updateMarkers();
  }, [map, showMarkers, props.activePermit, locations]);

  useEffect(() => {
    if (!data || !map) {
      return;
    }
    data.permits.edges.forEach((p) => {
      if (!p.node.bounds) {
        return;
      }
      var geojsonFeature = {
        type: "Feature",
        geometry: JSON.parse(p.node.bounds.geojson),
      };
      const polygon = Leaflet.geoJSON(geojsonFeature, {
        style: { fill: false },
      });
      polygon.addTo(map);
    });
  }, [data, map]);

  //zoom to active permit when set
  useEffect(() => {
    if (props.zoomTarget) {
      map.flyTo([props.zoomTarget.y, props.zoomTarget.x], 16, {
        duration: 0.6,
      });
    }
  }, [props.zoomTarget]);

  //refetch permit data on filter change
  useEffect(() => {
    if (!props.filterVars) {
      return;
    }
    getPermits({ variables: props.filterVars });
  }, [props.filterVars]);

  useEffect(() => {
    //get all locations
    if (data) {
      var locs = [];
      data.permits.edges.forEach((p) => {
        locs.push({
          id: p.node.id,
          x: p.node.location.x,
          y: p.node.location.y,
        });
      });
      setLocations(locs);

      //setup heatmap
      if (showHeatmap) {
        var heatmap_data = [];
        locations.forEach((l) => {
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
    if (showHeatmap && locations.length > 0) {
      var heatmap_data = [];
      locations.forEach((l) => {
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

  //enable disable markers
  useEffect(() => {
    if (!data) {
      return;
    }
    if (showMarkers) {
      updateMarkers();
    } else {
      removeOldMarkers();
    }
  }, [showMarkers]);

  //resize map to show all markers
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

  function removeOldMarkers() {
    for (let layer in map._layers) {
      const l = map._layers[layer];
      if (l instanceof Leaflet.Marker) {
        map.removeLayer(l);
      }
    }
  }

  function updateMarkers() {
    if (!showMarkers) {
      return;
    }
    props.setZoomTarget(null);
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    const markerLocations = computeMarkers(
      zoom,
      lat,
      locations,
      props.activePermit
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
    if (props.activePermit) {
      var icon = Leaflet.divIcon({
        html: '<h1><span class="bi bi-star-fill active-marker"></span></h1>',
        className: "",
        iconSize: [32, 42],
      });
      var marker = Leaflet.marker(
        [props.activePermit.location.y, props.activePermit.location.x],
        {
          icon: icon,
        }
      );
      marker.on("mouseover", (e) => {
        props.setPermitForModal({
          id: props.activePermit.id,
          x: e.containerPoint.y,
          y: e.containerPoint.x,
          overMarker: true,
        });
      });
      marker.on("mouseout", (e) => {
        props.setPermitForModal({
          id: props.activePermit.id,
          x: e.containerPoint.y,
          y: e.containerPoint.x,
          overMarker: false,
        });
      });
      marker.addTo(map);
      marker.setZIndexOffset(99);
    }
  }

  return (
    <>
      <div id="map">
        <div id="map-controls" className="leaflet-bottom leaflet-right">
          <button
            className="btn btn-light"
            onClick={() => setShowMarkers((x) => !x)}
          >
            markers
          </button>
          <button
            className="btn btn-light"
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
