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
import useSettingsStore from "../store/settings";
import { classNames } from "../utils/classNames";

interface Props {
  permit: Permit;
  setActivePermit: React.Dispatch<React.SetStateAction<UpdatablePermit | null>>;
  nextPermit?: Permit | null;
  isModal?: boolean;
}
function PermitBox(props: Props) {
  //is the urbanscape dropdown visible

  const hideVideos = useSettingsStore((s) => s.hideVideos);
  const [showUrbanscape, setShowUrbanscape] = useState(false);
  const videoRef = useRef(null);

  const { data } = useQuery(USER_QUERY);
  const autoplayVideo = useSettingsStore((s) => s.videoAutoplay);

  const image_dir = "/data/";
  const video_filename = image_dir + props.permit.imageUrl;
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
          <div className={classNames(hideVideos ? "no-videos" : "", "permit-grid")}>
            {!hideVideos && (
              <div className="video">
                <video
                  ref={videoRef}
                  autoPlay={autoplayVideo}
                  loop
                  muted
                  controls
                  width={512}
                >
                  <source src={video_filename} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <div className="permit-title">
              <button
                className="btn btn-sm btn-info -ml-4 mr-3"
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
            <div className="permit-data overflow-auto">
              <PermitData permit={props.permit} />
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
              {props.permit.kmlUrl ? (
                <>
                  <a
                    href={props.permit.kmlUrl}
                    className="cursor-pointer hover:fill-blue-600"
                  >
                    <svg viewBox="0 0 115.28 122.88" className="w-8 h-8">
                      <path
                        d="M25.38 57h64.88V37.34H69.59c-2.17 0-5.19-1.17-6.62-2.6-1.43-1.43-2.3-4.01-2.3-6.17V7.64H8.15c-.18 0-.32.09-.41.18-.15.1-.19.23-.19.42v106.45c0 .14.09.32.18.41.09.14.28.18.41.18h81.51c.18 0 .17-.09.27-.18.14-.09.33-.28.33-.41v-11.16H25.38c-4.14 0-7.56-3.4-7.56-7.56V64.55c0-4.15 3.4-7.55 7.56-7.55zm4.36 11.66h6.92v8.47l7.26-8.47h9.21l-8.18 8.42 8.56 14h-8.52l-4.73-9.21-3.6 3.75v5.46h-6.92V68.66zm25.53 0h9.14l3.48 13.64 3.49-13.64h9.1v22.42h-5.67v-17.1l-4.37 17.1H65.3l-4.36-17.1v17.1h-5.67V68.66zm29.16 0h6.92v16.91h10.84v5.51H84.43V68.66zM97.79 57h9.93c4.16 0 7.56 3.41 7.56 7.56v31.42c0 4.15-3.41 7.56-7.56 7.56h-9.93v13.55c0 1.61-.65 3.04-1.7 4.1a5.74 5.74 0 0 1-4.1 1.7H5.81a5.74 5.74 0 0 1-4.1-1.7 5.74 5.74 0 0 1-1.7-4.1V5.85c0-1.61.65-3.04 1.7-4.1a5.81 5.81 0 0 1 4.1-1.7h58.72c.13-.05.27-.05.41-.05.64 0 1.29.28 1.75.69h.09c.09.05.14.09.23.18L97 31.23c.51.51.88 1.2.88 1.98 0 .23-.05.41-.09.65V57zM67.52 27.97V8.94l21.43 21.7H70.19c-.74 0-1.38-.32-1.89-.78-.46-.46-.78-1.15-.78-1.89z"
                        style={{ fillRule: "evenodd" }}
                      />
                    </svg>
                  </a>
                  {/*I'm so sorry you had to see this...*/}
                  {[...Array(8)].map(() => (
                    <span></span>
                  ))}
                </>
              ) : (
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
              )}
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
