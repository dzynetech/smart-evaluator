import { useQuery, gql } from "@apollo/client";
import SourceStats from "./SourceStats.js";

import "./Stats.css";
const SOURCES_QUERY = gql`
  query GetAllSources {
    sources {
      nodes {
        description
        id
        name
      }
    }
  }
`;

function Stats() {
  const { loading, error, data } = useQuery(SOURCES_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <h1 className="text-center">Source Statistics</h1>
      <div className="stats-container">
        {data.sources.nodes.map((n) => (
          <SourceStats source={n} />
        ))}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </>
  );
}

export default Stats;
