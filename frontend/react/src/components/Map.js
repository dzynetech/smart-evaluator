import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import useMap from "./dzyne_components/hooks/useMap";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PERMITS_QUERY from "../queries/PermitsQuery";

import { useLazyQuery } from "@apollo/client";
import { computeMarkers, circleWithText } from "../utils/LocationGrouping";

window.locs = [];

const Map = forwardRef((props, ref) => {
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  if (error) console.log(error);

  useImperativeHandle(ref, () => ({
    zoomToPermit() {
      //this -> calling JSX component
      const loc = [this.permit.location.y, this.permit.location.x];
      map.flyTo(loc, 15, {
        duration: 0.6,
      });
    },
  }));

  function updateMarkers() {
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    const markerLocations = computeMarkers(zoom, lat, window.locs);
    //remove old markers
    for (let layer in map._layers) {
      const l = map._layers[layer];
      if (l instanceof Leaflet.Marker) {
        map.removeLayer(l);
      }
    }
    for (let m of markerLocations) {
      const marker = circleWithText([m.y, m.x], m.ids.length, m.r, 2);
      marker.bindTooltip(JSON.stringify(m.ids), {
        // permanent: true,
        direction: "right",
      });
      marker.addTo(map);
    }
  }

  const map = useMap("map", {}, {}, (map) => {
    map.on("zoomend", updateMarkers);
  });

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

  return <div id="map"></div>;
});

export default Map;