import { useQuery } from "@apollo/client";
import RAW_JSON_QUERY from "../queries/RawJSONQuery";

function ViewRawJSON(props) {
  const { data } = useQuery(RAW_JSON_QUERY, {
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
