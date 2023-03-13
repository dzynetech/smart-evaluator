import PermitBox from "./PermitBox";

import { useQuery, gql } from "@apollo/client";

import "./PermitModal.css";
import { useEffect, useLayoutEffect, useState } from "react";
import { borderColorMap } from "../utils/Colors";
import PopupData from "../interfaces/PopupData";
import UpdatablePermit from "../interfaces/UpdatablePermit";
import { Permit } from "../generated/graphql";
import PERMIT_QUERY from "../queries/PermitByIdQuery";

interface Props extends PopupData {
  setPopupData: (popupData: PopupData | null) => void;
  setActivePermit: React.Dispatch<React.SetStateAction<UpdatablePermit | null>>;
}

function PermitModal(props: Props) {
  const { error, data } = useQuery(PERMIT_QUERY, {
    // fetchPolicy: "no-cache",
    variables: {
      id: props.id,
    },
  });

  const [yOffset, setYOffset] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const map = document.getElementById("map");
    if (map) {
      setYOffset(map.getBoundingClientRect().y);
    }
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

  const permit: Permit = data.permit;

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
            borderTop: "1.5rem solid " + borderColorMap[permit.classification],
          }}
        ></div>
      </div>
    </>
  );
}

export default PermitModal;
