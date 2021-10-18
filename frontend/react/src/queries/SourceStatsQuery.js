import { gql } from "@apollo/client";

const SOURCE_STATS_QUERY = gql`
  query SourceByClassification($sourceId: Int, $minSqft: Float) {
    total: permits(
      condition: { sourceId: $sourceId }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }
    unclassified: permits(
      condition: { sourceId: $sourceId, classification: UNCLASSIFIED }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }
    construction: permits(
      condition: { sourceId: $sourceId, classification: CONSTRUCTION }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }
    not_construction: permits(
      condition: { sourceId: $sourceId, classification: NOT_CONSTRUCTION }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }

    possible_construction: permits(
      condition: { sourceId: $sourceId, classification: POSSIBLE_CONSTRUCTION }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }
    duplicate: permits(
      condition: { sourceId: $sourceId, classification: DUPLICATE }
      filter: {
        imageUrl: { isNull: false }
        sqft: { greaterThanOrEqualTo: $minSqft }
      }
    ) {
      totalCount
    }
  }
`;

export default SOURCE_STATS_QUERY;
