import { useQuery } from "@apollo/client";
import { FilterVars } from "../interfaces/FilterVars";
import ALL_PERMITS_QUERY from "../queries/AllPermitsQuery";

interface Props {
  filterVars: FilterVars | null;
}

function ViewRawJSON(props: Props) {
  const { data } = useQuery(ALL_PERMITS_QUERY, {
    variables: props.filterVars,
  });

  function getJsonFile() {
    var queryResponseJSON = JSON.stringify(data);
    var d = new Blob([queryResponseJSON], { type: "text/plain" });
    var url = window.URL.createObjectURL(d);
    window.location.href = url;
  }
  return (
    <button
      onClick={getJsonFile}
      className="btn btn-link"
      data-toggle="tooltip"
      data-placement="top"
      title="view raw JSON"
      disabled={!data}
    >
      <i className="bi bi-file-earmark-code"></i>
      View raw JSON
    </button>
  );
}

export default ViewRawJSON;
