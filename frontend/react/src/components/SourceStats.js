import { useQuery, gql } from "@apollo/client";
import { Pie } from "react-chartjs-2";

const TOTAL_QUERY = gql`
  query TotalPermits($sourceId: Int) {
    permits(
      condition: { sourceId: $sourceId }
      filter: { imageUrl: { isNull: false } }
    ) {
      totalCount
    }
  }
`;

const CLASSIFICATION_QUERY = gql`
  query TotalPermits($sourceId: Int, $classification: Classification) {
    permits(
      condition: { sourceId: $sourceId, classification: $classification }
      filter: { imageUrl: { isNull: false } }
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

  if (
    total.loading ||
    unclassified.loading ||
    construction.loading ||
    not_construction.loading ||
    possible_construction.loading ||
    duplicate.loading
  )
    return <p>Loading...</p>;
  if (total.error) return <p>Error with Total</p>;
  if (unclassified.error) return <p>Error with unclassified</p>;
  if (construction.error) return <p>Error with consruction</p>;
  if (not_construction.error) return <p>Error with not consruction</p>;
  if (possible_construction.error)
    return <p>Error with possible consruction</p>;
  if (duplicate.error) return <p>Error with duplicate</p>;

  const state = {
    labels: [
      "Unclassified",
      "Construction",
      "Not Construction",
      "Possible Construction",
      "Duplicate",
    ],
    datasets: [
      {
        label: "Rainfall",
        backgroundColor: [
          "#B21F00",
          "#C9DE00",
          "#2FDE00",
          "#00A6B4",
          "#6800B4",
        ],
        hoverBackgroundColor: [
          "#501800",
          "#4B5000",
          "#175000",
          "#003350",
          "#35014F",
        ],
        data: [
          unclassified.data.permits.totalCount,
          construction.data.permits.totalCount,
          not_construction.data.permits.totalCount,
          possible_construction.data.permits.totalCount,
          duplicate.data.permits.totalCount,
        ],
      },
    ],
  };

  return (
    <>
      <div className="statBox">
        <h2 className="text-center">{props.source.name}</h2>
        <div className="row">
          <div className="col-4 stat-data">
            <b>Permits:</b> {total.data.permits.totalCount}
            <br />
            <b>Unclassified:</b> {unclassified.data.permits.totalCount}
            <br />
            <b>Construction:</b> {construction.data.permits.totalCount}
            <br />
            <b>Not Construction:</b> {not_construction.data.permits.totalCount}
            <br />
            <b>Possible Construction:</b>
            {possible_construction.data.permits.totalCount}
            <br />
            <b>Duplicate:</b> {duplicate.data.permits.totalCount}
            <br />
          </div>
          <div className="col-8">
            <Pie className="chart" data={state} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SourceStats;
