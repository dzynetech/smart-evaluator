import { useLazyQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { print } from "graphql/language/printer";

import PermitsFilter from "./PermitsFilter.js";
import PermitBox from "./PermitBox.js";
import CurlModal from "./CurlModal";
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
  ) {
    permits(
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
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getPermits({ variables: filterVars });
    if (error) console.log(error);
  }, [filterVars]);

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
          {data && <p>Filter returned {data.permits.totalCount} results</p>}
          <CurlModal
            query={JSON.stringify(print(PERMITS_QUERY))}
            variables={JSON.stringify(filterVars)}
          />
          {data &&
            data.permits.edges.map((p) => (
              <PermitBox key={p.node.id} permit={p.node} />
            ))}
        </div>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </>
  );
}

export default Permits;
