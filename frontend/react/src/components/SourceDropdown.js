import { useQuery } from "@apollo/client";
import SOURCES_QUERY from "../queries/SourcesQuery";

function SourceDropdown(props) {
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
      <option value="ALL">All</option>
      {data &&
        data.sources.nodes.map((source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
    </select>
  );
}

export default SourceDropdown;
