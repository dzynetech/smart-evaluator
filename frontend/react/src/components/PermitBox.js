import React from "react";
import PermitData from "./PermitData";
import PermitNote from "./PermitNote.js";
import PermitButtons from "./PermitButtons.js";
import { colorMap, borderColorMap } from "../utils/Colors.js";

import "./PermitBox.css";

function PermitBox(props) {
  const image_dir = "/data/";
  const mp4_filename = image_dir + props.permit.imageUrl + ".mp4";
  const borderColor = borderColorMap[props.permit.classification];
  const backgroundColor = colorMap[props.permit.classification];
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
        <div
          className="permitBox"
          style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
          id={props.permit.id}
        >
          <div className="video">
            <video autoPlay loop muted controls>
              <source src={mp4_filename} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="permit-title">
            <b style={{ fontSize: "23px" }}>{address}</b>
          </div>
          <div className="permit-info">
            <table>
              <tbody>
                <tr>
                  <td>Cost: </td>
                  <td>
                    <b className="f18">${props.permit.cost.toLocaleString()}</b>
                  </td>
                </tr>
                <tr>
                  <td>Sqft: </td>
                  <td>
                    <b className="f18">{props.permit.sqft.toLocaleString()}</b>
                  </td>
                </tr>
                <tr>
                  <td>Permit Date:&nbsp;&nbsp;&nbsp;</td>
                  <td>{props.permit.issueDate}</td>
                </tr>
                <tr>
                  <td>Lat/Long:</td>
                  <td>
                    ({props.permit.location.y},{props.permit.location.x})
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="permit-actions">
            <p>Construction?</p>
            <PermitButtons
              permit={props.permit}
              nextPermit={props.nextPermit}
              setActivePermit={props.setActivePermit}
            />
            <PermitNote permit={props.permit} />
          </div>
          <div className="permit-data">
            <PermitData
              permit={props.permit}
              border={borderColor}
              backgroundColor={backgroundColor}
            />
          </div>
          <div className="permit-sidebar text-center">
            <br />
            <h3
              onClick={() => {
               if (props.setActivePermit) {
                 props.setActivePermit(props.permit);
               }
              }}
            >
              <i className="bi bi-geo-alt"></i>
            </h3>
            <br />
            {["2016", "2017", "2018", "2019", "2020", "2021"].map((y) => (
              <React.Fragment key={y}>
                <a href={image_dir + props.permit.id + " " + y + "-07-01.kml"}>
                  {y}
                </a>
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PermitBox;
