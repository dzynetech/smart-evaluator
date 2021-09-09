import { useLazyQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { print } from "graphql/language/printer";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PermitsFilter from "./PermitsFilter.js";
import PermitBox from "./PermitBox.js";
import CurlModal from "./CurlModal";
import FilterPagination from "./FilterPagination";
import useMap from "./dzyne_components/hooks/useMap";

import PERMITS_QUERY from "../queries/PermitsQuery";
import { computeMarkers, circleWithText } from "../utils/LocationGrouping";

function Permits() {
  const [filterVars, setFilterVars] = useState({});
  const [page, setPage] = useState(1);
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const permitsPerPage = 20;
  window.locs = [];

  useEffect(() => {
    var queryVars = {};
    Object.assign(queryVars, filterVars);
    queryVars.numPerPage = permitsPerPage;
    queryVars.offset = permitsPerPage * (page - 1);
    getPermits({ variables: queryVars });
    if (error) console.log(error);
  }, [filterVars, page]);

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
      map.fitBounds(bounds);
      updateMarkers();
    }
  }, [data]);

  function getJsonFile() {
    var queryResponseJSON = JSON.stringify(data);
    var d = new Blob([queryResponseJSON], { type: "text/plain" });
    var url = window.URL.createObjectURL(d);
    window.location.href = url;
  }

  return (
    <>
      <div className="site">
        <div className="sidebar">
          <div className="filter">
            <PermitsFilter
              setFilterVars={setFilterVars}
              getJsonFile={getJsonFile}
            />
          </div>
          <div id="map"></div>
        </div>
        <div id="main" className="container-fluid">
          <h1>Construction sites</h1>
          <h3>Permits: 2017 - 2019</h3>
          {data && (
            <p>
              Showing results {(page - 1) * permitsPerPage + 1} -
              {" " +
                Math.min(page * permitsPerPage, data.permits.totalCount) +
                " "}
              of {data.permits.totalCount}
            </p>
          )}
          {data && (
            <FilterPagination
              page={page}
              setPage={setPage}
              total={data.permits.totalCount}
              permitsPerPage={permitsPerPage}
            />
          )}
          <CurlModal
            query={JSON.stringify(print(PERMITS_QUERY))}
            variables={JSON.stringify(filterVars)}
          />
          {data &&
            data.permits.edges.map((p) => (
              <PermitBox key={p.node.id} permit={p.node} />
            ))}
          {data && (
            <FilterPagination
              page={page}
              setPage={setPage}
              total={data.permits.totalCount}
              permitsPerPage={permitsPerPage}
              center={true}
            />
          )}
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </>
  );
}

export default Permits;
