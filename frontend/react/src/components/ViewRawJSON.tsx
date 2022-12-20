import { useQuery } from "@apollo/client";
import { useState } from "react";
import { FilterVars } from "../interfaces/FilterVars";
import UNPAGED_PERMITS_QUERY from "../queries/UnpagedPermitsQuery";
import QuittableModal from "./QuitableModal";

interface Props {
  filterVars: FilterVars | null;
}

function ViewRawJSON(props: Props) {
  const { data } = useQuery(UNPAGED_PERMITS_QUERY, { variables: props.filterVars, });
  const [showModal ,setShowModal] = useState(false)
  const [json,setJson] = useState("")
  const [copied, setCopied] = useState(false)


  function getJsonFile() {
    var queryResponseJSON = JSON.stringify(data);
    setJson(queryResponseJSON)
    setShowModal(true)
    // var d = new Blob([queryResponseJSON], { type: "text/plain" });
    // var url = window.URL.createObjectURL(d);
    // window.location.href = url;
  }

  function onCopy() {
    setCopied(false)
    navigator.clipboard.writeText(json)
    setCopied(true)
  }
  return (
    <>
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
      <QuittableModal open={showModal} setOpen={setShowModal}>
        <h3 className="text-center">Raw JSON</h3>
        <hr />
        <div className="mx-auto max-w-lg max-h-[400px] overflow-auto">
          <button
          className="btn btn-primary btn-sm float-right"
          onClick={onCopy}
          >
            Copy to Clipboard
          </button>
          {copied && <p className="float-right text-gray-500 mr-2 mt-2">Copied!</p>}
          <br/>
          <code>
            {json}
          </code>
        </div>
      </QuittableModal>
      </>
  );
}

export default ViewRawJSON;
