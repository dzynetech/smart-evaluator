import { useQuery, gql } from "@apollo/client";
import { Pie } from "react-chartjs-2";
import { altColorMap, borderColorMap } from "../utils/Colors";
import SOURCE_STATS_QUERY from "../queries/SourceStatsQuery";
import { Source } from "../generated/graphql";

interface Props {
  source: Source,
  minSqft: Number, 
}

function SourceStats(props : Props) {
  const sourceId = props.source.id;
  const { data } = useQuery(SOURCE_STATS_QUERY, {
    variables: {
      sourceId: sourceId,
      minSqft: props.minSqft,
    },
  });
  if (!data) return <></>;

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
          data.unclassified.totalCount,
          data.construction.totalCount,
          data.not_construction.totalCount,
          data.possible_construction.totalCount,
          data.duplicate.totalCount,
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
            <b>Permits:</b> {data.total.totalCount}
            <br />
            <b>Unclassified:</b> {data.unclassified.totalCount}
            <br />
            <b>Construction:</b> {data.construction.totalCount}
            <br />
            <b>Not Construction:</b> {data.not_construction.totalCount}
            <br />
            <b>Possible Construction:</b>
            {data.possible_construction.totalCount}
            <br />
            <b>Duplicate:</b> {data.duplicate.totalCount}
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
