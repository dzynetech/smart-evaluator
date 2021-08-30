import React from "react";
import PermitDataTable from "./PermitDataTable";
import PermitNote from "./PermitNote.js";

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

	function setYes(id) {
    document.getElementById(id).style.border = colors.CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.CONSTRUCTION.backgroundColor;
    classify(id, "CONSTRUCTION");
  }

  function setNo(id) {
    document.getElementById(id).style.border = colors.NOT_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.NOT_CONSTRUCTION.backgroundColor;
    classify(id, "NOT_CONSTRUCTION");
  }

  function setMaybe(id) {
    document.getElementById(id).style.border =
      colors.POSSIBLE_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.POSSIBLE_CONSTRUCTION.backgroundColor;
    classify(id, "POSSIBLE_CONSTRUCTION");
  }

  function setDuplicate(id) {
    document.getElementById(id).style.border = colors.DUPLICATE.border;
    document.getElementById(id).style.backgroundColor =
      colors.DUPLICATE.backgroundColor;
    classify(id, "DUPLICATE");
  }

  function setUnclassified(id) {
    document.getElementById(id).style.border = colors.UNCLASSIFIED.border;
    document.getElementById(id).style.backgroundColor =
      colors.UNCLASSIFIED.backgroundColor;
    classify(id, "UNCLASSIFIED");
  }

  async function classify(id, classification) {
    let CLASSIFY_PERMIT_MUT = `
		mutation classifyPermit($id: Int!, $classification: Classification) {
			updatePermit(input: { patch: { classification: $classification }, id: $id }) {
				clientMutationId
				permit {
					id
					classification
				}
			}
		}
		`;
  }

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
                    onClick={() => {
                      setNo(props.permit.id);
                    }}
                  >
                    <u>N</u>o
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setYes(props.permit.id);
                    }}
                  >
                    <u>Y</u>es
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setMaybe(props.permit.id);
                    }}
                  >
                    Maybe
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setDuplicate(props.permit.id);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setUnclassified(props.permit.id);
                    }}
                  >
                    Reset
                  </button>
                  <p />
                  <PermitNote permit={props.permit} />
                </td>
                <td>
                  {["2016", "2017", "2018", "2019", "2020", "2021"].map((y) => (
                    <React.Fragment key={y}>
                      <a
                        href={
                          image_dir + props.permit.id + " " + y + "-07-01.kml"
                        }
                      >
                        {y}
                      </a>
                      <br />
                    </React.Fragment>
                  ))}
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
