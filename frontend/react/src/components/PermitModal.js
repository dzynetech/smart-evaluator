import PermitBox from "./PermitBox.js";

import { useQuery, gql } from "@apollo/client";

import "./PermitModal.css";
import { useEffect, useLayoutEffect, useState } from "react";

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
      id: props.popupData?.id,
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
    if (!isMouseOver && props.popupData && !props.popupData.overMarker) {
      const t = setTimeout(() => {
        props.setPopupData(null);
      }, 100);
      setTimer(t);
    }
    if (isMouseOver || props.popupData?.overMarker) {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }, [isMouseOver, props.popupData]);

  if (!data) {
    if (error && props.popupData != null) {
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
          top: props.popupData.x + yOffset,
          left: props.popupData.y,
        }}
        onMouseLeave={() => {
          setIsMouseOver(false);
        }}
        onMouseEnter={() => {
          setIsMouseOver(true);
        }}
      >
        <PermitBox permit={data.permit} />
        <div className="arrow-down"></div>
      </div>
    </>
  );
}

export default PermitModal;
