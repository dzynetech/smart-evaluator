import { useQuery } from "@apollo/client";
import React from "react";
import { Source } from "../generated/graphql";
import SOURCES_QUERY from "../queries/SourcesQuery";

interface Props {
  source: string;
  setSource: (source: string) => void;
  noneOption?: boolean;
}

function SourceDropdown(props: Props) {
  const { data } = useQuery(SOURCES_QUERY, {
    fetchPolicy: "cache-first",
  });
  return (
    <select
      className="custom-select my-1 mr-sm-2"
      id="source_filter"
      value={props.source}
      onChange={(e) => {
        props.setSource(e.target.value);
      }}
    >
      {props.noneOption && <option value="NONE">None</option>}
      <option value="ALL">All</option>
      {data &&
        data.sources.nodes.map((source: Source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
    </select>
  );
}

export default SourceDropdown;
