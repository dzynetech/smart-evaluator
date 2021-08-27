import PermitDataTable from "./PermitDataTable";

function PermitRow(props) {
  const colors = {
    UNCLASSIFIED: {
      border: "8px solid #EEE",
      backgroundColor: "#FFFFFF",
    },
    CONSTRUCTION: {
      border: "8px solid #00CC00",
      backgroundColor: "#CCFFCC",
    },
    NOT_CONSTRUCTION: {
      border: "8px solid #FF0000",
      backgroundColor: "#FFCCCC",
    },
    POSSIBLE_CONSTRUCTION: {
      border: "8px solid #DDDD00",
      backgroundColor: "#FFFF99",
    },
    DUPLICATE: {
      border: "8px solid #FF0000",
      backgroundColor: "#FFCCCC",
    },
    HIGHLIGHT: {
      border: "8px solid #999",
      backgroundColor: "#EEEEEE",
    },
  };

  const image_dir = "/data/";
  const mp4_filename = image_dir + props.permit.id + ".mp4";
  const border = colors[props.permit.classification].border;
  const backgroundColor = colors[props.permit.classification].backgroundColor;
  const address =
    props.permit.streetNumber +
    " " +
    props.permit.street +
    ", " +
    props.permit.city +
    ", " +
    props.permit.state +
    " " +
    props.permit.zip;

  return (
    <>
      <div className="row">
        <div className="row align-items-center">
          <table
            className="col-lg-8 col-md-auto"
            style={{ border: border, backgroundColor: backgroundColor }}
            id="{props.permit.id}"
          >
            <tbody>
              <tr>
                <td>
                  <video autoPlay loop muted controls>
                    <source src={mp4_filename} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </td>
                <td style={{ width: "500px" }}>
                  <b style={{ fontSize: "23px" }}>{address}</b>
                  <br />
                  Cost: <b>{props.permit.cost}</b>
                  Sqft: <b>{props.permit.sqft}</b>
                  <br />({props.permit.location.x}, {props.permit.location.y})
                  <br />
                  id: {props.permit.id}
                  <p />
                  <p />
                  Construction?
                  <p />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onclick="setNo(${i},${image_id})"
                  >
                    <u>N</u>o
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onclick="setYes(${i},${image_id})"
                  >
                    <u>Y</u>es
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onclick="setMaybe(${i},${image_id})"
                  >
                    Maybe
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onclick="setDuplicate(${i},${image_id})"
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onclick="setUnclassNameified(${i},${image_id})"
                  >
                    Reset
                  </button>
                  <p />
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      style={{ width: "100%" }}
                      id={"notes-" + props.permit.id}
                      rows="2"
                      placeholder="Enter a note"
                      onblur="onTextAreaBlur(${image_id})"
                      defaultValue={props.permit.notes || ""}
                    ></textarea>
                  </div>
                </td>
                <td>
                  <a href="${image_dir}${props.permit.id} 2016-07-01.kml">
                    2016
                  </a>
                  <br />
                  <a href="${image_dir}${props.permit.id} 2017-07-01.kml">
                    2017
                  </a>
                  <br />
                  <a href="${image_dir}${props.permit.id} 2018-07-01.kml">
                    2018
                  </a>
                  <br />
                  <a href="${image_dir}${props.permit.id} 2019-07-01.kml">
                    2019
                  </a>
                  <br />
                  <a href="${image_dir}${props.permit.id} 2020-07-01.kml">
                    2020
                  </a>
                  <br />
                  <a href="${image_dir}${props.permit.id} 2021-07-01.kml">
                    2021
                  </a>
                  <br />
                </td>
              </tr>
            </tbody>
          </table>
          <PermitDataTable
            permit={props.permit}
            border={border}
            backgroundColor={backgroundColor}
          />
        </div>
      </div>
    </>
  );
}

export default PermitRow;
