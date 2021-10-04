import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { print } from "graphql/language/printer";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PermitsFilter from "./PermitsFilter.js";
import PermitBox from "./PermitBox.js";
import CurlModal from "./CurlModal";
import FilterPagination from "./FilterPagination";
import Map from "./Map.js";
import Nav from "./Nav";
import PermitModal from "./PermitModal";
import PERMITS_QUERY from "../queries/PermitsQuery";
import USER_QUERY from "../queries/UserQuery";
import Legend from "./Legend";

function Permits(props) {
  const [filterVars, setFilterVars] = useState({});
  const [finalQueryVars, setFinalQueryVars] = useState({});
  const [page, setPage] = useState(1);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [activePermit, setActivePermit] = useState(null);
  const [prevActivePermit, setPrevActivePermit] = useState(null);
  const [permitForModal, setPermitForModal] = useState(null);
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
    queryVars.hasBounds = Boolean(props?.hasBounds);
    getPermits({ variables: queryVars });
    console.log(queryVars);
    setFinalQueryVars(queryVars);
  }, [filterVars, page]);

  useEffect(() => {
    const permitDiv = document.getElementById(activePermit?.id);
    document.getElementById(prevActivePermit?.id)?.classList.remove("selected");
    permitDiv?.classList.add("selected");
    permitDiv?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    setPrevActivePermit(activePermit);
    if (activePermit) {
      setZoomTarget(activePermit.location);
    }
    window.activePermit = activePermit;
  }, [activePermit]);

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
          <Map
            setPermitForModal={setPermitForModal}
            filterVars={filterVars}
            activePermit={activePermit}
            zoomTarget={zoomTarget}
            setZoomTarget={setZoomTarget}
          />
        </div>
        <div id="main" className="container-fluid">
          <Nav active={"classify"} jwt={props.jwt} setJwt={props.setJwt} />
          <PermitModal
            permitId={permitForModal}
            setPermitId={setPermitForModal}
          />
          <div className="title">
            <div>
              <h1>Construction sites</h1>
            </div>
            <Legend />
          </div>
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
            variables={JSON.stringify(finalQueryVars)}
          />
          {data &&
            data.permits.edges.map((p, i, permits) => (
              <PermitBox
                key={p.node.id}
                permit={p.node}
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
