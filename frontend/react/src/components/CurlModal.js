function CurlModal(props) {
  function closeModal() {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("curlModal").style.display = "none";
    document.getElementById("curlModal").classList.remove("show");
  }

  var modal = document.getElementById("curlModal");
  window.onclick = function (event) {
    if (event.target === modal) {
      closeModal();
    }
  };
  return (
    <>
      <div className="modal fade" id="curlModal" tabIndex="-1">
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
                curl -g --user admin:admin \<br />
                -X POST \<br />
                -H "Content-Type: application/json" \<br />
                -d '&#123;"query": {props.query}, "variables": {props.variables}
                ,"operationName":"MyQuery"&#125;' \<br />
                http://smart.dzynetech.com:4401/graphql
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
