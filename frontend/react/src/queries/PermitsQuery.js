import { gql } from "@apollo/client";

const PERMITS_QUERY = gql`
  query MyQuery(
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
    $numPerPage: Int
    $offset: Int
    $hasBounds: Boolean
  ) {
    permits(
      first: $numPerPage
      offset: $offset
      orderBy: $order
      filter: {
        and: {
          hasBounds: { equalTo: $hasBounds }
          imageUrl: { isNull: false }
          sqft: { greaterThanOrEqualTo: $min_sqft }
          cost: { greaterThanOrEqualTo: $min_cost }
          classification: $classification
          sourceId: $sourceId
          city: { includesInsensitive: $city }
          street: { includesInsensitive: $street }
          state: { includesInsensitive: $state }
          zip: { includesInsensitive: $zip }
          permitData: { includesInsensitive: $permitData }
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
        }
      }
      totalCount
    }
  }
`;
export default PERMITS_QUERY;
