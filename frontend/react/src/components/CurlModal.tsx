interface Props {
  query: string;
  variables: string;
  jwt: string | null;
}

function CurlModal(props: Props) {
  function closeModal() {
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {
      backdrop.style.display = "none";
    }
    const modal = document.getElementById("curlModal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("show");
    }
  }

  var modal = document.getElementById("curlModal");
  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };

  function modifyQuery(query: string): string {
    query = query.replace(", $numPerPage: Int, $offset: Int", "");
    query = query.replace("first: $numPerPage", "");
    query = query.replace("offset: $offset", "");
    return query;
  }

  return (
    <>
      <div className="modal fade" id="curlModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="curlModalLabel">
                Using cURL
              </h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <code>
                curl -g -X POST \<br />
                -H "Content-Type: application/json" \<br />
                -H "Authorization: Bearer {props.jwt}" \<br />
                -d '&#123;"query": {modifyQuery(props.query)}, "variables":{" "}
                {props.variables}
                ,"operationName":"PermitsQuery"&#125;' \<br />
                http://{window.location.host}/graphql
              </code>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        id="backdrop"
        style={{ display: "none" }}
      ></div>
    </>
  );
}

export default CurlModal;
