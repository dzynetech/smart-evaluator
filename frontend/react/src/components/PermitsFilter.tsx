import React, { useEffect, useState } from "react";
import StateDropdown from "./StateDropdown";
import SourceDropdown from "./SourceDropdown";
import ViewRawJSON from "./ViewRawJSON";

import "./PermitsFilter.css";
import { Filter, FilterVars } from "../interfaces/FilterVars";

interface Props {
  setFilterVars: (filterVars: FilterVars | null) => void;
  filterVars: any;
}

function PermitsFilter(props: Props) {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [minCost, setMinCost] = useState("");
  const [minSqft, setMinSqft] = useState("");
  const [classification, setClassification] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [order, setOrder] = useState("SQFT_DESC");
  const [permitData, setPermitData] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setFilter(null);
  }, [classification, order, state, source]);

  function setFilter(e: React.FormEvent<HTMLFormElement> | null) {
    if (e) {
      e.preventDefault();
    }
    var c: Filter | undefined;
    if (classification === "ALL") {
      c = undefined;
    } else {
      c = { equalTo: classification };
    }
    var sid: Filter | undefined;
    if (source === "ALL") {
      sid = undefined;
    } else {
      sid = { equalTo: Number(source) };
    }

    props.setFilterVars({
      order: order,
      classification: c,
      sourceId: sid,
      min_sqft: Number(minSqft),
      min_cost: Number(minCost),
      street: street,
      city: city,
      state: state,
      zip: zip,
      permitData: permitData,
      note: note,
    });
  }

  function openModal() {
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {
      backdrop.style.display = "block";
    }
    const curlModal = document.getElementById("curlModal");
    if (curlModal) {
      curlModal.style.display = "block";
      curlModal.classList.add("show");
    }
  }

  return (
    <>
      <div className="order">
        <h5>Order By:</h5>
        <div className="form-row">
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
      <h5>Filter By:</h5>
      <form onSubmit={setFilter} className="filter-form">
        <div id="classification-filter">
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
            <option value="POSSIBLE_CONSTRUCTION">Maybe Construction</option>
            <option value="DUPLICATE">Duplicate</option>
          </select>
        </div>
        <div id="source-filter">
          <label className="my-1 mr-2" htmlFor="source_filter">
            Source:
          </label>
          <SourceDropdown source={source} setSource={setSource} />
        </div>
        <div id="street-filter">
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
        <div id="city-filter">
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
        <div id="state-filter">
          <label className="my-1 mr-2" htmlFor="stateFilter">
            State:
          </label>
          <StateDropdown state={state} setState={setState} />
        </div>
        <div id="zip-filter">
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
        <div id="cost-filter">
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
        <div id="size-filter">
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
        <div id="permitdata-filter">
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
        <div id="notes-filter">
          <label className="my-1 mr-2" htmlFor="noteFilter">
            Notes Contain:
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            type="text"
            className="form-control my-1 mr-2"
            id="noteFilter"
          ></input>
        </div>
        <div id="apply-btn">
          <input type="submit" className="btn btn-primary mb-2" value="Apply" />
        </div>
      </form>
      <button
        type="button"
        className="btn btn-link"
        onClick={openModal}
        data-toggle="tooltip"
        data-placement="top"
        title="view cURL instructions"
      >
        <i className="bi bi-info-circle"></i>
        cURL instructions
      </button>
      {props.filterVars && <ViewRawJSON filterVars={props.filterVars} />}
    </>
  );
}

export default PermitsFilter;
