import React, { useState, useRef, useEffect } from "react";
import PermitData from "./PermitData";
import PermitNote from "./PermitNote";
import PermitButtons from "./PermitButtons";
import { colorMap, borderColorMap } from "../utils/Colors";
import { useQuery } from "@apollo/client";
import USER_QUERY from "../queries/UserQuery";

import "./PermitBox.css";
import UrbanscapeVideos from "./UrbanscapeVideos";
import { Permit } from "../generated/graphql";
import UpdatablePermit from "../interfaces/UpdatablePermit";

interface Props {
  permit: Permit;
  setActivePermit: React.Dispatch<React.SetStateAction<UpdatablePermit | null>>;
  nextPermit?: Permit | null;
  isModal?: boolean;
}
function PermitBox(props: Props) {
  //is the urbanscape dropdown visible
  const [showUrbanscape, setShowUrbanscape] = useState(false);
  const videoRef = useRef(null);

  const { data } = useQuery(USER_QUERY);

  const image_dir = "/data/";
  const mp4_filename = image_dir + props.permit.imageUrl + ".mp4";
  const borderColor = borderColorMap[props.permit.classification];
  const backgroundColor = colorMap[props.permit.classification];

  function isUrbanscapeVisible() {
    //true if this permit should have an urbanscape dropdown button
    return (
      props.permit.source?.hasUrbanscapeVideos &&
      data &&
      data.currentUser.urbanscape
    );
  }

  return (
    <>
      <div className="row">
        <div
          className="permit-box"
          style={{ borderColor: borderColor, backgroundColor: backgroundColor }}
          id={props.isModal ? undefined : String(props.permit.id)}
        >
          <div className="permit-grid">
            <div className="video">
              <video ref={videoRef} autoPlay loop muted controls width={512}>
                <source src={mp4_filename} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="permit-title">
              <button
                className="btn btn-sm btn-info"
                style={{ marginTop: "-0.5rem" }}
                onClick={() => {
                  if (props.setActivePermit) {
                    props.setActivePermit({
                      ...props.permit,
                      time: Date.now(),
                    });
                  }
                }}
              >
                Select
              </button>
              <b>{props.permit.name}</b>
            </div>
            <div className="permit-info">
              <table>
                <tbody>
                  {props.permit.cost > 0 && (
                    <tr>
                      <td>Cost: </td>
                      <td>
                        <b>${props.permit.cost.toLocaleString()}</b>
                      </td>
                    </tr>
                  )}
                  {props.permit.sqft > 0 && (
                    <tr>
                      <td>Sqft: </td>
                      <td>
                        <b>{props.permit.sqft.toLocaleString()}</b>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Permit Date:&nbsp;&nbsp;&nbsp;</td>
                    <td>{props.permit.issueDate}</td>
                  </tr>
                  <tr>
                    <td>Lat/Long:</td>
                    <td>
                      ({props.permit.location?.y},{props.permit.location?.x})
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
              <h3
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  if (props.setActivePermit) {
                    props.setActivePermit({
                      ...props.permit,
                      time: Date.now(),
                    });
                  }
                }}
              >
                <i className="bi bi-geo-alt"></i>
              </h3>
              <div>
                {["2016", "2017", "2018", "2019", "2020", "2021"].map((y) => (
                  <div key={y}>
                    <a
                      href={
                        image_dir + props.permit.id + " " + y + "-07-01.kml"
                      }
                    >
                      {y}
                    </a>
                    <br />
                  </div>
                ))}
              </div>
              {isUrbanscapeVisible() && (
                <h3 onClick={() => setShowUrbanscape((x) => !x)}>
                  {!showUrbanscape && (
                    <i className="bi bi-arrow-down-square-fill"></i>
                  )}
                  {showUrbanscape && (
                    <i className="bi bi-arrow-up-square-fill"></i>
                  )}
                </h3>
              )}
              {!isUrbanscapeVisible() && <br />}
            </div>
          </div>
          {showUrbanscape && (
            <UrbanscapeVideos id={props.permit.id} masterVideoRef={videoRef} />
          )}
        </div>
      </div>
    </>
  );
}

export default PermitBox;
