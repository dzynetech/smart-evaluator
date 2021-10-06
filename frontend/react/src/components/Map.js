import React, { useState, useEffect, useRef } from "react";
import useMap from "./dzyne_components/hooks/useMap";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PERMITS_QUERY from "../queries/PermitsQuery";
import PermitBox from "./PermitBox";
import { useLocation } from "react-router";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { computeMarkers, circleWithText } from "../utils/LocationGrouping";
import { createMapLayers } from "../utils/MapLayers";
import { setTooltip } from "../utils/SetTooltip";
window.locs = [];

function Map(props) {
  const [getPermits, { error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const apolloClient = useApolloClient();
  if (error) console.log(error);

  function updateMarkers() {
    props.setZoomTarget(null);
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    const markerLocations = computeMarkers(
      zoom,
      lat,
      window.locs,
      window.activePermit
    );
    //remove old markers
    for (let layer in map._layers) {
      const l = map._layers[layer];
      if (l instanceof Leaflet.Marker) {
        map.removeLayer(l);
      }
    }
    for (let m of markerLocations) {
      const marker = circleWithText([m.y, m.x], m.ids.length, m.r, 2, m.active);
      if (m.ids.length === 1) {
        setTimeout(() => setTooltip(marker, m.ids[0], apolloClient), 0);
        marker.on("click", () => {
          props.setPermitForModal(m.ids[0]);
        });
      }
      marker.addTo(map);
    }
  }

  const map = useMap("map", {}, {}, (map) => {
    map.on("zoomend", updateMarkers);
    createMapLayers(map);
  });

  if (props.zoomTarget) {
    map.flyTo([props.zoomTarget.y, props.zoomTarget.x], 16, {
      duration: 0.6,
    });
  }

  const router_location = useLocation();

  useEffect(() => {
    if (Object.keys(props.filterVars).length === 0) {
      return;
    }
    var queryVars = {};
    Object.assign(queryVars, props.filterVars);
    queryVars.numPerPage = 9999;
    queryVars.offset = 0;
    getPermits({ variables: queryVars });
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
    }
  }, [data]);

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
      <div id="map"></div>
    </>
  );
}

export default Map;
