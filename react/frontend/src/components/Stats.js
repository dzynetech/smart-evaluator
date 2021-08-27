import { useQuery, gql } from "@apollo/client";
import SourceStats from "./SourceStats.js";
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
      <div className="row">
        {data.sources.nodes.map((n) => (
          <div className="col-md-4">
            <SourceStats source={n} />
          </div>
        ))}
      </div>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </>
  );
}

export default Stats;
