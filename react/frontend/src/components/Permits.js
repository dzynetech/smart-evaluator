import { useQuery, gql } from "@apollo/client";
import SourceStats from "./SourceStats.js";
const PERMITS_QUERY = gql`
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

function Permits() {
  const { loading, error, data } = useQuery(PERMITS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <>rtest</>;
}

export default Permits;
