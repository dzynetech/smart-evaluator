import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";

import SourceStats from "./SourceStats.js";
import StatsFilter from "./StatsFilter.js";
import SOURCES_QUERY from "../queries/SourcesQuery.js";
import "./Stats.css";

function Stats() {
  const [minSqft, setMinSqft] = useState(0);

  const { loading, error, data } = useQuery(SOURCES_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  function setFilter(e, sqft) {
    e.preventDefault();
    setMinSqft(Number(sqft));
  }
  return (
    <>
      <h1 className="text-center">Source Statistics</h1>
      <StatsFilter setFilter={setFilter} />

      <div className="stats-container">
        {data.sources.nodes.map((n) => (
          <SourceStats source={n} minSqft={minSqft} />
        ))}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </>
  );
}

export default Stats;
