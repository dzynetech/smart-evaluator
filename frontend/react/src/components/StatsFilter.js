import React, { useState } from "react";

function StatsFilter(props) {
  const [minSqft, setMinSqft] = useState("");
  return (
    <form
      id="stats-filter"
      className="form-inline"
      onSubmit={(e) => {
        props.setFilter(e, minSqft);
      }}
    >
      <div id="form-group">
        <label
          className="my-1 mr-2"
          htmlFor="minSqftFilter"
          style={{ justifyContent: "left" }}
        >
          Min Square Footage:
        </label>
        <input
          value={minSqft}
          onChange={(e) => setMinSqft(e.target.value)}
          type="number"
          className="form-control mr-2"
          id="minSqftFilter"
          placeholder="0"
        ></input>
        <input type="submit" className="btn btn-primary mb-2" value="Apply" />
      </div>
    </form>
  );
}

export default StatsFilter;
