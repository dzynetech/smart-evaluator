import { useQuery, useLazyQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
import PermitsFilter from "./PermitsFilter.js";
import PermitRow from "./PermitRow.js";

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
          notes
        }
      }
      totalCount
    }
  }
`;

function Permits() {

  const [filterVars, setFilterVars] = useState({});
  const [getPermits, { loading, error, data }] = useLazyQuery(PERMITS_QUERY);

  useEffect(() => {
    getPermits({ variables: filterVars });
    if (error) console.log(error);
  }, [filterVars]);

  function getJsonFile() {
    var queryResponseJSON = JSON.stringify(data);
    var d = new Blob([queryResponseJSON], { type: "text/plain" });
    var url = window.URL.createObjectURL(d);
    window.location.href = url;
  }

  return (
    <>
      <h1>Construction sites</h1>
      <h3>Permits: 2017 - 2019</h3>
      <PermitsFilter setFilterVars={setFilterVars} getJsonFile={getJsonFile} />
      {data && <p>Filter returned {data.permits.totalCount} results</p>}
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="curlModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Using cURL
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <code>
                curl -g --user admin:admin \<br />
                -X POST \<br />
                -H "Content-Type: application/json" \<br />
                -d '&#123;"query": {"FIX ME"}
                ,"operationName":"MyQuery"&#125;' \<br />
                http://smart.dzynetech.com:4401/graphql
              </code>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="home" style={{ minHeight: "1000px", position: "relative" }}>
        {data &&
          data.permits.edges.map((p) => (
            <PermitRow key={p.node.id} permit={p.node} />
          ))}
      </div>

      <button
        id="permitDataButton"
        className="btn btn-primary"
        onClick={() => {} /*toggleShowPermitData()*/}
      >
        Hide Permit Data
      </button>
      <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </>
  );
}

export default Permits;
