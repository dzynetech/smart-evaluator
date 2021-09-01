import React, { useEffect, useState } from "react";
import StateDropdown from "./StateDropdown";

function PermitsFilter(props) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [minCost, setMinCost] = useState("");
  const [minSqft, setMinSqft] = useState("");
  const [classification, setClassification] = useState("ALL");
  const [order, setOrder] = useState("SQFT_DESC");
  const [permitData, setPermitData] = useState("");

  useEffect(() => {
    setFilter();
  }, [classification, order, state]);

  function setFilter(e) {
    if (e) {
      e.preventDefault();
    }
    var c;
    if (classification === "ALL") {
      c = undefined;
    } else {
      c = { equalTo: classification };
    }

    props.setFilterVars({
      order: order,
      classification: c,
      min_sqft: Number(minSqft),
      min_cost: Number(minCost),
      street: street,
      city: city,
      state: state,
      zip: zip,
      permitData: permitData,
    });
  }

  function openModal() {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("curlModal").style.display = "block";
    document.getElementById("curlModal").classList.add("show");
  }

  return (
    <>
      <h5>Filter By:</h5>
      <div className="container-fluid">
        <form onSubmit={setFilter}>
          <div className="row">
            <div className="col-lg-8">
              <div className="form-row">
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="streetFilter">
                    Street:
                  </label>
                  <input
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    type="text"
                    className="my-1 mr-2 form-control"
                    id="streetFilter"
                  ></input>
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="cityFilter">
                    City:
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    type="text"
                    className="form-control my-1 mr-2"
                    id="cityFilter"
                  ></input>
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="stateFilter">
                    State:
                  </label>
                  <StateDropdown state={state} setState={setState} />
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="zipFilter">
                    Zip:
                  </label>
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    type="text"
                    className="form-control my-1 mr-2"
                    id="zipFilter"
                  ></input>
                </div>
              </div>
              <div className="form-row">
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="classification_filter">
                    Classification:
                  </label>
                  <select
                    className="custom-select my-1 mr-sm-2"
                    id="classification_filter"
                    value={classification}
                    onChange={(e) => {
                      setClassification(e.target.value);
                    }}
                  >
                    <option value="ALL">All</option>
                    <option value="UNCLASSIFIED">Unclassified</option>
                    <option value="CONSTRUCTION">Construction</option>
                    <option value="NOT_CONSTRUCTION">Not Construction</option>
                    <option value="POSSIBLE_CONSTRUCTION">
                      Maybe Construction
                    </option>
                    <option value="DUPLICATE">Duplicate</option>
                  </select>
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="minCostFilter">
                    Min Cost:
                  </label>
                  <input
                    value={minCost}
                    onChange={(e) => setMinCost(e.target.value)}
                    type="number"
                    className="form-control my-1 mr-2"
                    id="minCostFilter"
                    placeholder="$0"
                  ></input>
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="minSqftFilter">
                    Min Square Footage:
                  </label>
                  <input
                    value={minSqft}
                    onChange={(e) => setMinSqft(e.target.value)}
                    type="number"
                    className="form-control my-1 mr-2"
                    id="minSqftFilter"
                    placeholder="0"
                  ></input>
                </div>
                <div className="form-col">
                  <label className="my-1 mr-2" htmlFor="permitDataFilter">
                    Permit Data Contains:
                  </label>
                  <input
                    value={permitData}
                    onChange={(e) => setPermitData(e.target.value)}
                    type="text"
                    className="form-control my-1 mr-2"
                    id="permitDataFilter"
                  ></input>
                </div>
                <div className="form-col">
                  <div style={{ marginTop: "35px", marginLeft: "10px" }}>
                    <input
                      type="submit"
                      className="btn btn-primary mb-2"
                      value="Apply"
                    />
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={openModal}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="view cURL instructions"
                    >
                      <h4>
                        <i className="bi bi-info-circle"></i>
                      </h4>
                    </button>
                    <button
                      onClick={props.getJsonFile}
                      className="btn btn-link"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="view raw JSON"
                    >
                      <h4>
                        <i className="bi bi-file-earmark-code"></i>
                      </h4>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-auto"></div>
            <div className="col-lg-3">
              <h5>Order By:</h5>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="custom-select my-1 mr-sm-2"
                id="selectOrder"

                // onChange={setFilter}
              >
                {/* <!-- <option selected value="NATURAL">ID</option> --> */}
                <option value="SQFT_DESC">Size</option>
                <option value="COST_DESC">Cost</option>
                <option value="STREET_ASC">Street Name</option>
                {/* <!-- <option value="STREET_ASC">Street Name </option> --> */}
              </select>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default PermitsFilter;
