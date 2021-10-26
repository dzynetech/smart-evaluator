import { gql } from "@apollo/client";

const PERMITS_QUERY = gql`
  query PermitsQuery(
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
    $note: String
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
          permitDataText: { includesInsensitive: $permitData }
          notes: { includesInsensitive: $note }
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
          bounds {
            geojson
          }
        }
      }
      totalCount
    }
  }
`;
export default PERMITS_QUERY;
