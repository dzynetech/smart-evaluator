import React, { useContext } from "react";
import { permitContext } from "../App";
import { useMutation, gql } from "@apollo/client";
import { colorMap, borderColorMap } from "../utils/Colors";

const CLASSIFY_PERMIT_MUT = gql`
  mutation classifyPermit($id: Int!, $classification: Classification) {
    updatePermit(
      input: { patch: { classification: $classification }, id: $id }
    ) {
      clientMutationId
      permit {
        id
        classification
      }
    }
  }
`;

function PermitButtons(props) {
  const [classifyPermit] = useMutation(CLASSIFY_PERMIT_MUT);
  const { readonly } = useContext(permitContext);

  async function classify(classification) {
    props.setActivePermit(props.nextPermit);
    classifyPermit({
      variables: {
        id: props.permit.id,
        classification: classification,
      },
    });
  }

  function setYes(id) {
    document.getElementById(id).style.borderColor = borderColorMap.CONSTRUCTION;
    document.getElementById(id).style.backgroundColor = colorMap.CONSTRUCTION;
    classify("CONSTRUCTION");
  }

  function setNo(id) {
    document.getElementById(id).style.borderColor =
      borderColorMap.NOT_CONSTRUCTION;
    document.getElementById(id).style.backgroundColor =
      colorMap.NOT_CONSTRUCTION;
    classify("NOT_CONSTRUCTION");
  }

  function setMaybe(id) {
    document.getElementById(id).style.borderColor =
      borderColorMap.POSSIBLE_CONSTRUCTION;
    document.getElementById(id).style.backgroundColor =
      colorMap.POSSIBLE_CONSTRUCTION;
    classify("POSSIBLE_CONSTRUCTION");
  }

  function setDuplicate(id) {
    document.getElementById(id).style.borderColor = borderColorMap.DUPLICATE;
    document.getElementById(id).style.backgroundColor = colorMap.DUPLICATE;
    classify("DUPLICATE");
  }

  function setUnclassified(id) {
    document.getElementById(id).style.borderColor = borderColorMap.UNCLASSIFIED;
    document.getElementById(id).style.backgroundColor = colorMap.UNCLASSIFIED;
    classify("UNCLASSIFIED");
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        disabled={readonly}
        onClick={() => {
          setYes(props.permit.id);
        }}
      >
        <u>Y</u>es
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={readonly}
        onClick={() => {
          setNo(props.permit.id);
        }}
      >
        <u>N</u>o
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={readonly}
        onClick={() => {
          setMaybe(props.permit.id);
        }}
      >
        Maybe
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={readonly}
        onClick={() => {
          setDuplicate(props.permit.id);
        }}
      >
        Duplicate
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={readonly}
        onClick={() => {
          setUnclassified(props.permit.id);
        }}
      >
        Reset
      </button>
    </>
  );
}
export default PermitButtons;
