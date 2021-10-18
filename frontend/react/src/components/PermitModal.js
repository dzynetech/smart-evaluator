import PermitBox from "./PermitBox.js";

import { useQuery, gql } from "@apollo/client";

import "./PermitModal.css";
import { useEffect, useLayoutEffect, useState } from "react";
import { borderColorMap } from "../utils/Colors.js";
const PERMIT_QUERY = gql`
  query PermitById($id: Int!) {
    permit(id: $id) {
      id
      cost
      city
      sqft
      state
      street
      streetNumber
      source {
        name
      }
      location {
        x
        y
      }
      zip
      permitData
      classification
      issueDate
      notes
      imageUrl
      name
    }
  }
`;
function PermitModal(props) {
  const { error, data } = useQuery(PERMIT_QUERY, {
    // fetchPolicy: "no-cache",
    variables: {
      id: props.id,
    },
  });

  const [yOffset, setYOffset] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [timer, setTimer] = useState(null);

  useLayoutEffect(() => {
    const map = document.getElementById("map");
    setYOffset(map.getBoundingClientRect().y);
  }, [yOffset]);

  useEffect(() => {
    if (!isMouseOver && !props.overMarker) {
      const t = setTimeout(() => {
        props.setPopupData(null);
      }, 100);
      setTimer(t);
    }
    if (isMouseOver || props.overMarker) {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }, [isMouseOver, props.overMarker]);

  if (!data) {
    if (error && props != null) {
      console.log(error);
    }
    return <></>;
  }

  return (
    <>
      <div
        className="permit-modal"
        id="permit-modal"
        style={{
          top: props.x + yOffset,
          left: props.y,
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
        onMouseEnter={() => {
          setIsMouseOver(true);
        }}
      >
        <PermitBox
          permit={data.permit}
          setActivePermit={props.setActivePermit}
          isModal
        />
        <div
          className="arrow-down"
          style={{
            borderTop:
              "1.5rem solid " + borderColorMap[data.permit.classification],
          }}
        ></div>
      </div>
    </>
  );
}

export default PermitModal;
