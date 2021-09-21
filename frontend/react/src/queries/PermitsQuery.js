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
  ) {
    permits(
      first: $numPerPage
      offset: $offset
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
          permitData: { includesInsensitive: $permitData }
          hasLocation: { equalTo: true }
          and: {
            or: [
              { permitData: { includes: "COMOTH" } }
              { permitData: { includes: "COMRET" } }
              { permitData: { includes: "Commercial" } }
              { permitData: { includes: "New Construction" } }
              { permitData: { includes: "NEWCON" } }
              { permitData: { includes: "ERECT" } }
            ]
          }
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
