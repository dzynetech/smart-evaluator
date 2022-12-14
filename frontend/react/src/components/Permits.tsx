import { useLazyQuery, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { print } from "graphql/language/printer";
import Leaflet, { circle, DivIcon, marker } from "leaflet";
import PermitsFilter from "./PermitsFilter";
import PermitBox from "./PermitBox";
import CurlModal from "./CurlModal";
import FilterPagination from "./FilterPagination";
import Map from "./Map";
import Nav from "./Nav";
import PermitModal from "./PermitModal";
import PERMITS_QUERY from "../queries/PermitsQuery";
import Legend from "./Legend";
import "./Permits.css";
import { GeometryPoint, Permit, PermitsEdge } from "../generated/graphql";
import UpdatablePermit from "../interfaces/UpdatablePermit";
import { FilterVars, QueryVars } from "../interfaces/FilterVars";
import PopupData from "../interfaces/PopupData";

interface Props {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}

function Permits(props: Props) {
  const [filterVars, setFilterVars] = useState<FilterVars | null>(null);
  const [page, setPage] = useState(1);
  const [zoomTarget, setZoomTarget] = useState<GeometryPoint | undefined>(
    undefined
  );
  const [activePermit, setActivePermit] = useState<UpdatablePermit | null>(
    null
  );
  const [sourceFilterState, setSourceFilterState] = useState("ALL");
  const [prevActivePermit, setPrevActivePermit] = useState<Permit | null>(null);
  const [popupData, setPopupData] = useState<PopupData | null>(null);
  const [getPermits, { error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  if (error) console.log(error);
  const permitsPerPage = 20;

  useEffect(() => {
    if (!filterVars) {
      return;
    }
    var queryVars: QueryVars = {
      order: filterVars.order,
      classification: filterVars.classification,
      sourceId: filterVars.sourceId,
      min_sqft: filterVars.min_sqft,
      min_cost: filterVars.min_cost,
      street: filterVars.street,
      city: filterVars.city,
      state: filterVars.state,
      zip: filterVars.zip,
      permitData: filterVars.permitData,
      note: filterVars.note,
      numPerPage: permitsPerPage,
      offset: permitsPerPage * (page - 1),
    };
    getPermits({ variables: queryVars });
    console.log(queryVars);
  }, [filterVars, page]);

  useEffect(() => {
    const permitDiv = document.getElementById(String(activePermit?.id));
    const prevPermitDiv = document.getElementById(String(prevActivePermit?.id));
    prevPermitDiv?.classList.remove("selected");
    permitDiv?.classList.add("selected");
    permitDiv?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    setPrevActivePermit(activePermit);
    if (activePermit?.location) {
      setZoomTarget(activePermit.location);
    }
  }, [activePermit]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (page > Math.ceil(data.permits.totalCount / permitsPerPage)) {
      setPage(1);
    }
  }, [data]);

  return (
    <>
      <div className="site">
        <div className="sidebar">
          <div className="filter">
            <PermitsFilter
              setFilterVars={setFilterVars}
              filterVars={filterVars}
              setSourceFilterState={setSourceFilterState}
            />
          </div>
          <Map
            setPermitForModal={setPopupData}
            filterVars={filterVars}
            activePermit={activePermit}
            zoomTarget={zoomTarget}
            setZoomTarget={setZoomTarget}
            sourceFilterState={sourceFilterState}
          />
        </div>
        <div id="main">
          <Nav active={"classify"} jwt={props.jwt} setJwt={props.setJwt} />
          {popupData && (
            <PermitModal
              {...popupData}
              setPopupData={setPopupData}
              setActivePermit={setActivePermit}
            />
          )}
          <div id="permit-content" className="container-fluid">
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
              query={JSON.stringify(
                print(PERMITS_QUERY).replace(/(\r\n|\n|\r)/gm, "")
              )}
              variables={JSON.stringify(filterVars)}
              jwt={props.jwt}
            />
            {data &&
              data.permits.edges.map(
                (p: PermitsEdge, i: number, permits: PermitsEdge[]) =>
                  p.node && (
                    <PermitBox
                      key={p.node?.id}
                      permit={p.node}
                      nextPermit={permits[i + 1]?.node}
                      setActivePermit={setActivePermit}
                    />
                  )
              )}
            {data && (
              <FilterPagination
                page={page}
                setPage={setPage}
                total={data.permits.totalCount}
                permitsPerPage={permitsPerPage}
                center
              />
            )}
          </div>
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </>
  );
}

export default Permits;
