import { gql } from "@apollo/client";

//permits query without pagination or source
const ALL_BOUNDS_QUERY = gql`
  query AllPermitsQuery {
    permits(
      filter: {
        and: { imageUrl: { isNull: false }, hasBounds: { equalTo: true } }
      }
    ) {
      edges {
        node {
          id
          location {
            x
            y
          }
          classification
          name
          bounds {
            geojson
          }
        }
      }
      totalCount
    }
  }
`;
export default ALL_BOUNDS_QUERY;
