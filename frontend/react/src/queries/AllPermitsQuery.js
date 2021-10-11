import { gql } from "@apollo/client";

//permits query without pagination
const ALL_PERMITS_QUERY = gql`
  query AllPermitsQuery(
    $order: [PermitsOrderBy!]
    $classification: ClassificationFilter
    $sourceId: IntFilter
    $min_sqft: Float
    $min_cost: Float
    $city: String
    $street: String
    $state: String
    $zip: String
    $permitData: String
  ) {
    permits(
      orderBy: $order
      filter: {
        and: {
          imageUrl: { isNull: false }
          sqft: { greaterThanOrEqualTo: $min_sqft }
          cost: { greaterThanOrEqualTo: $min_cost }
          classification: $classification
          sourceId: $sourceId
          city: { includesInsensitive: $city }
          street: { includesInsensitive: $street }
          state: { includesInsensitive: $state }
          zip: { includesInsensitive: $zip }
          permitDataBackup: { includesInsensitive: $permitData }
          hasLocation: { equalTo: true }
        }
      }
    ) {
      edges {
        node {
          id
          cost
          city
          sqft
          state
          street
          streetNumber
          source {
            name
            hasUrbanscapeVideos
          }
          location {
            x
            y
          }
          zip
          permitData
          classification
          issueDate
          notes
          imageUrl
          name
        }
      }
      totalCount
    }
  }
`;
export default ALL_PERMITS_QUERY;
