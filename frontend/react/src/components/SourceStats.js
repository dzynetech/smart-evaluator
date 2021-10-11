import { useQuery, gql } from "@apollo/client";
import { Pie } from "react-chartjs-2";
import { altColorMap, borderColorMap } from "../utils/Colors";
import SOURCE_STATS_QUERY from "../queries/SourceStatsQuery";

function SourceStats(props) {
  const sourceId = props.source.id;
  const {
    data: statsData,
    loading,
    error,
  } = useQuery(SOURCE_STATS_QUERY, {
    variables: {
      sourceId: sourceId,
      minSqft: props.minSqft,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

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
        hoverBackgroundColor: [
          altColorMap.UNCLASSIFIED,
          altColorMap.CONSTRUCTION,
          altColorMap.NOT_CONSTRUCTION,
          altColorMap.POSSIBLE_CONSTRUCTION,
          altColorMap.DUPLICATE,
        ],
        backgroundColor: [
          borderColorMap.UNCLASSIFIED,
          borderColorMap.CONSTRUCTION,
          borderColorMap.NOT_CONSTRUCTION,
          borderColorMap.POSSIBLE_CONSTRUCTION,
          borderColorMap.DUPLICATE,
        ],
        data: [
          statsData.unclassified.totalCount,
          statsData.construction.totalCount,
          statsData.not_construction.totalCount,
          statsData.possible_construction.totalCount,
          statsData.duplicate.totalCount,
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
            <b>Permits:</b> {statsData.total.totalCount}
            <br />
            <b>Unclassified:</b> {statsData.unclassified.totalCount}
            <br />
            <b>Construction:</b> {statsData.construction.totalCount}
            <br />
            <b>Not Construction:</b> {statsData.not_construction.totalCount}
            <br />
            <b>Possible Construction:</b>
            {statsData.possible_construction.totalCount}
            <br />
            <b>Duplicate:</b> {statsData.duplicate.totalCount}
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
