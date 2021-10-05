import React, { useContext } from "react";
import { permitContext } from "../App";
import { useMutation, gql, useQuery } from "@apollo/client";
import { colorMap, borderColorMap } from "../utils/Colors";
import USER_QUERY from "../queries/UserQuery";

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
  const { data: user_data } = useQuery(USER_QUERY);

  async function classify(classification) {
    if (props.setActivePermit) {
      props.setActivePermit(props.nextPermit);
    }
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
  if (!user_data) {
    return <></>;
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!user_data.isAnnotator}
        onClick={() => {
          setYes(props.permit.id);
        }}
      >
        <u>Y</u>es
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!user_data.isAnnotator}
        onClick={() => {
          setNo(props.permit.id);
        }}
      >
        <u>N</u>o
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!user_data.isAnnotator}
        onClick={() => {
          setMaybe(props.permit.id);
        }}
      >
        Maybe
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!user_data.isAnnotator}
        onClick={() => {
          setDuplicate(props.permit.id);
        }}
      >
        Duplicate
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!user_data.isAnnotator}
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
