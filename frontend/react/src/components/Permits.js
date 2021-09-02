import { useLazyQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { print } from "graphql/language/printer";

import PermitsFilter from "./PermitsFilter.js";
import PermitBox from "./PermitBox.js";
import CurlModal from "./CurlModal";
import FilterPagination from "./FilterPagination";
import useMap from "./dzyne_components/hooks/useMap";
const PERMITS_QUERY = gql`
  query MyQuery(
    $order: [PermitsOrderBy!]
    $classification: ClassificationFilter
    $min_sqft: Float
    $min_cost: Float
    $city: String
    $street: String
    $state: String
    $zip: String
    $permitData: String
    $numPerPage: Int
    $offset: Int
  ) {
    permits(
      first: $numPerPage
      offset: $offset
      orderBy: $order
      filter: {
        and: {
          imageUrl: { isNull: false }
          sqft: { greaterThanOrEqualTo: $min_sqft }
          cost: { greaterThanOrEqualTo: $min_cost }
          classification: $classification
          # sourceId
          city: { includesInsensitive: $city }
          street: { includesInsensitive: $street }
          state: { includesInsensitive: $state }
          zip: { includesInsensitive: $zip }
          permitData: { includesInsensitive: $permitData }
          hasLocation: { equalTo: true }
          and: {
            or: [
              { permitData: { includes: "COMOTH" } }
              { permitData: { includes: "COMRET" } }
              { permitData: { includes: "Commercial" } }
              { permitData: { includes: "New Construction" } }
              { permitData: { includes: "NEWCON" } }
              { permitData: { includes: "ERECT" } }
            ]
          }
        }
      }
    ) {
      edges {
        node {
          id
          cost
          city
          sqft
          state
          street
          streetNumber
          source {
            name
          }
          location {
            x
            y
          }
          zip
          permitData
          classification
          permitIssueDate
          notes
        }
      }
      totalCount
    }
  }
`;

function Permits() {
  const [filterVars, setFilterVars] = useState({});
  const [page, setPage] = useState(1);
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const permitsPerPage = 20;

  useEffect(() => {
    var queryVars = {};
    Object.assign(queryVars, filterVars);
    queryVars.numPerPage = permitsPerPage;
    queryVars.offset = permitsPerPage * (page - 1);
    getPermits({ variables: queryVars });
    if (error) console.log(error);
  }, [filterVars, page]);

  useMap("map", {});

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
          <PermitsFilter
            setFilterVars={setFilterVars}
            getJsonFile={getJsonFile}
          />
          <div
            id="map"
            style={{
              height: 300,
              width: "100%",
            }}
          ></div>
        </div>
        <div id="main" className="container-fluid">
          <h1>Construction sites</h1>
          <h3>Permits: 2017 - 2019</h3>
          {data && (
            <p>
              Showing results {(page - 1) * permitsPerPage + 1} -
              {" " + Math.min(page * permitsPerPage, data.permits.totalCount)}{" "}
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
