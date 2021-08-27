import { useQuery, gql } from "@apollo/client";

const TOTAL_QUERY = gql`
  query TotalPermits($sourceId: Int) {
    permits(condition: { sourceId: $sourceId }) {
      totalCount
    }
  }
`;

const CLASSIFICATION_QUERY = gql`
  query TotalPermits($sourceId: Int, $classification: Classification) {
    permits(
      condition: { sourceId: $sourceId, classification: $classification }
    ) {
      totalCount
    }
  }
`;

function SourceStats(props) {
  const sourceId = props.source.id;
  const total = useQuery(TOTAL_QUERY, {
    variables: { sourceId },
  });
  const unclassified = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "UNCLASSIFIED" },
  });
  const construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "CONSTRUCTION" },
  });
  const not_construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "NOT_CONSTRUCTION" },
  });
  const possible_construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "POSSIBLE_CONSTRUCTION" },
  });
  const duplicate = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "DUPLICATE" },
  });

  if (total.loading) return <p>Loading...</p>;
  if (total.error) return <p>Error with Total</p>;
  if (unclassified.loading) return <p>Loading...</p>;
  if (unclassified.error) return <p>Error with unclassified</p>;
  if (construction.loading) return <p>Loading...</p>;
  if (construction.error) return <p>Error with consruction</p>;
  if (not_construction.loading) return <p>Loading...</p>;
  if (not_construction.error) return <p>Error with not consruction</p>;
  if (possible_construction.loading) return <p>Loading...</p>;
  if (possible_construction.error)
    return <p>Error with possible consruction</p>;
  if (duplicate.loading) return <p>Loading...</p>;
  if (duplicate.error) return <p>Error with duplicate</p>;

  return (
    <>
      <h2 className="text-center">{props.source.name}</h2>
      <p>Permits: {total.data.permits.totalCount}</p>
      <p>Unclassified: {unclassified.data.permits.totalCount}</p>
      <p>Construction: {construction.data.permits.totalCount}</p>
      <p>Not Construction: {not_construction.data.permits.totalCount}</p>
      <p>
        Possible Construction: {possible_construction.data.permits.totalCount}
      </p>
      <p>Duplicate: {duplicate.data.permits.totalCount}</p>
    </>
  );
}

export default SourceStats;
