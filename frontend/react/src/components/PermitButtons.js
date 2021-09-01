import React, { useContext } from "react";
import { permitContext } from "../App";
import { useMutation, gql } from "@apollo/client";
import Colors from "../utils/Colors";

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
    classifyPermit({
      variables: {
        id: props.permit.id,
        classification: classification,
      },
    });
  }

  function setYes(id) {
    document.getElementById(id).style.border = Colors.CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      Colors.CONSTRUCTION.backgroundColor;
    classify("CONSTRUCTION");
  }

  function setNo(id) {
    document.getElementById(id).style.border = Colors.NOT_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      Colors.NOT_CONSTRUCTION.backgroundColor;
    classify("NOT_CONSTRUCTION");
  }

  function setMaybe(id) {
    document.getElementById(id).style.border =
      Colors.POSSIBLE_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      Colors.POSSIBLE_CONSTRUCTION.backgroundColor;
    classify("POSSIBLE_CONSTRUCTION");
  }

  function setDuplicate(id) {
    document.getElementById(id).style.border = Colors.DUPLICATE.border;
    document.getElementById(id).style.backgroundColor =
      Colors.DUPLICATE.backgroundColor;
    classify("DUPLICATE");
  }

  function setUnclassified(id) {
    document.getElementById(id).style.border = Colors.UNCLASSIFIED.border;
    document.getElementById(id).style.backgroundColor =
      Colors.UNCLASSIFIED.backgroundColor;
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
