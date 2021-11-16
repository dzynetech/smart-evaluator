import { gql } from "@apollo/client";

//permits query without pagination or source
const BOUNDS_QUERY = gql`
  query AllPermitsQuery($sourceId: IntFilter) {
    permits(
      filter: {
        and: {
          imageUrl: { isNull: false }
          hasBounds: { equalTo: true }
          sourceId: $sourceId
        }
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
export default BOUNDS_QUERY;
