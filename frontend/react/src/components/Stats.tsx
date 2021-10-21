import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";

import SourceStats from "./SourceStats";
import StatsFilter from "./StatsFilter";
import SOURCES_QUERY from "../queries/SourcesQuery";
import "./Stats.css";
import { Source } from "../generated/graphql";

function Stats() {
  const [minSqft, setMinSqft] = useState(0);

  const { data } = useQuery(SOURCES_QUERY);

  function setFilter(e : React.FormEvent<HTMLFormElement>, sqft : Number) {
    e.preventDefault();
    setMinSqft(Number(sqft));
  }
  return (
    <>
      <h1 className="text-center">Source Statistics</h1>
      <StatsFilter setFilter={setFilter} />

      <div className="stats-container">
        {data &&
          data.sources.nodes.map((source: Source) => (
            <SourceStats key={source.id} source={source} minSqft={minSqft} />
          ))}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </>
  );
}

export default Stats;
