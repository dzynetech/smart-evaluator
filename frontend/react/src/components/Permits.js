import { useLazyQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { print } from "graphql/language/printer";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PermitsFilter from "./PermitsFilter.js";
import PermitBox from "./PermitBox.js";
import CurlModal from "./CurlModal";
import FilterPagination from "./FilterPagination";
import Map from "./Map.js";

import PERMITS_QUERY from "../queries/PermitsQuery";

function Permits() {
  const [filterVars, setFilterVars] = useState({});
  const [page, setPage] = useState(1);
  const [activePermit, setActivePermit] = useState(null);
  const [prevActivePermit, setPrevActivePermit] = useState(null);
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });
  if (error) console.log(error);
  const permitsPerPage = 20;

  useEffect(() => {
    if (Object.keys(filterVars).length === 0) {
      return;
    }
    var queryVars = {};
    Object.assign(queryVars, filterVars);
    queryVars.numPerPage = permitsPerPage;
    queryVars.offset = permitsPerPage * (page - 1);
    getPermits({ variables: queryVars });
  }, [filterVars, page]);

  useEffect(() => {
    if (data) {
      setPrevActivePermit(activePermit);
      setActivePermit(data.permits.edges[0].node);
    }
  }, [data]);

  useEffect(() => {
    console.log(prevActivePermit);
    const permitDiv = document.getElementById(activePermit?.id);
    document.getElementById(prevActivePermit?.id)?.classList.remove("selected");
    permitDiv?.classList.add("selected");
    permitDiv?.scrollIntoView({
      behavior: "auto",
      block: "center",
      inline: "center",
    });
    setPrevActivePermit(activePermit);
    if (activePermit) {
      mapRef.current.zoomTo(activePermit.location);
    }
    console.log(activePermit);
  }, [activePermit]);

  function getJsonFile() {
    var queryResponseJSON = JSON.stringify(data);
    var d = new Blob([queryResponseJSON], { type: "text/plain" });
    var url = window.URL.createObjectURL(d);
    window.location.href = url;
  }

  const mapRef = useRef();

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
          <Map ref={mapRef} filterVars={filterVars} />
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
            data.permits.edges.map((p, i, permits) => (
              <PermitBox
                key={p.node.id}
                permit={p.node}
                zoomTo={mapRef.current.zoomTo}
                nextPermit={permits[i + 1]?.node}
                setActivePermit={setActivePermit}
              />
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
