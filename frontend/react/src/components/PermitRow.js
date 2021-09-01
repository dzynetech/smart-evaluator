import React from "react";
import PermitDataTable from "./PermitDataTable";
import PermitNote from "./PermitNote.js";
import PermitButtons from "./PermitButtons.js";

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
      <div className="row align-items-center">
        <table
          className="permitTable"
          style={{ border: border, backgroundColor: backgroundColor }}
          id={props.permit.id}
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
                <table>
                  <tr>
                    <td className="p0">Cost: </td>
                    <td className="p0">
                      <b>{props.permit.cost}</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="p0">Sqft: </td>
                    <td className="p0">
                      <b>{props.permit.sqft}</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="p0">Lat/Lng:&nbsp;&nbsp;&nbsp;</td>
                    <td className="p0">
                      <b>
                        ({props.permit.location.x}, {props.permit.location.y})
                      </b>
                    </td>
                  </tr>
                </table>
                Construction? <br />
                <PermitButtons permit={props.permit} />
                <p />
                <PermitNote permit={props.permit} />
              </td>
              <td>
                <PermitDataTable
                  permit={props.permit}
                  border={border}
                  backgroundColor={backgroundColor}
                />
              </td>
              <td className="glassy">
                <h3>
                  <i class="bi bi-pin-map"></i>
                </h3>
                <br />
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
      </div>
    </>
  );
}

export default PermitRow;
