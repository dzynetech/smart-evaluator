import React from "react";
import PermitData from "./PermitData";
import PermitNote from "./PermitNote.js";
import PermitButtons from "./PermitButtons.js";
import Colors from "../utils/Colors.js";

function PermitBox(props) {
  const image_dir = "/data/";
  const mp4_filename = image_dir + props.permit.id + ".mp4";
  const border = Colors[props.permit.classification].border;
  const backgroundColor = Colors[props.permit.classification].backgroundColor;
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
              <td style={{ width: "512px" }}>
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
                      <b className="f18">
                        ${props.permit.cost.toLocaleString()}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td className="p0">Sqft: </td>
                    <td className="p0">
                      <b className="f18">
                        {props.permit.sqft.toLocaleString()}
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td className="p0">Permit Date:&nbsp;&nbsp;&nbsp;</td>
                    <td className="p0">{props.permit.permitIssueDate}</td>
                  </tr>
                  <tr>
                    <td className="p0">Lat/Long:</td>
                    <td className="p0">
                      ({props.permit.location.y},{props.permit.location.x})
                    </td>
                  </tr>
                </table>
                <br /> Construction? <br />
                <PermitButtons permit={props.permit} />
                <p />
                <PermitNote permit={props.permit} />
              </td>
              <td>
                <PermitData
                  permit={props.permit}
                  border={border}
                  backgroundColor={backgroundColor}
                />
              </td>
              <td className="glassy text-center vw4">
                <h3>
                  <i class="bi bi-geo-alt"></i>
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

export default PermitBox;
