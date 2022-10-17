import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";

import SourceStats from "./SourceStats";
import StatsFilter from "./StatsFilter";
import SOURCES_QUERY from "../queries/SourcesQuery";
import "./Stats.css";
import { Source } from "../generated/graphql";
import MissionUploadForm from "./MissionUploadForm";

export default function Ingest() {
  const [minSqft, setMinSqft] = useState(0);

  const { data } = useQuery(SOURCES_QUERY);

  function setFilter(e : React.FormEvent<HTMLFormElement>, sqft : Number) {
    e.preventDefault();
    setMinSqft(Number(sqft));
  }
  return (
    <>
      <h1 className="text-center">Data Ingest</h1>
      <div className="mx-auto max-w-xl">
        <MissionUploadForm col={true} />
      </div>
    </>
  );
}

