import { gql } from "@apollo/client";
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
export default SOURCES_QUERY;
