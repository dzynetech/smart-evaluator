import React, { useContext } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { colorMap, borderColorMap } from "../utils/Colors";
import USER_QUERY from "../queries/UserQuery";
import { Permit } from "../generated/graphql";
import UpdatablePermit from "../interfaces/UpdatablePermit";

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

interface Props {
  permit: Permit;
  setActivePermit: React.Dispatch<React.SetStateAction<UpdatablePermit | null>>;
  nextPermit?: Permit | null;
}
function PermitButtons(props: Props) {
  const [classifyPermit] = useMutation(CLASSIFY_PERMIT_MUT);
  const { data } = useQuery(USER_QUERY);

  async function classify(classification: string) {
    if (props.setActivePermit && props.nextPermit) {
      props.setActivePermit(props.nextPermit);
    }
    classifyPermit({
      variables: {
        id: props.permit.id,
        classification: classification,
      },
    });
  }

  function setYes(id: number) {
    const element = document.getElementById(String(id));
    if (element) {
      element.style.borderColor = borderColorMap.CONSTRUCTION;
      element.style.backgroundColor = colorMap.CONSTRUCTION;
    }
    classify("CONSTRUCTION");
  }

  function setNo(id: number) {
    const element = document.getElementById(String(id));
    if (element) {
      element.style.borderColor = borderColorMap.NOT_CONSTRUCTION;
      element.style.backgroundColor = colorMap.NOT_CONSTRUCTION;
    }
    classify("NOT_CONSTRUCTION");
  }

  function setMaybe(id: number) {
    const element = document.getElementById(String(id));
    if (element) {
      element.style.borderColor = borderColorMap.POSSIBLE_CONSTRUCTION;
      element.style.backgroundColor = colorMap.POSSIBLE_CONSTRUCTION;
    }
    classify("POSSIBLE_CONSTRUCTION");
  }

  function setDuplicate(id: number) {
    const element = document.getElementById(String(id));
    if (element) {
      element.style.borderColor = borderColorMap.DUPLICATE;
      element.style.backgroundColor = colorMap.DUPLICATE;
    }
    classify("DUPLICATE");
  }

  function setUnclassified(id: number) {
    const element = document.getElementById(String(id));
    if (element) {
      element.style.borderColor = borderColorMap.UNCLASSIFIED;
      element.style.backgroundColor = colorMap.UNCLASSIFIED;
    }
    classify("UNCLASSIFIED");
  }
  if (!data) {
    return <></>;
  }
  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!data.currentUser.annotator}
        onClick={() => {
          setYes(props.permit.id);
        }}
      >
        <u>Y</u>es
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!data.currentUser.annotator}
        onClick={() => {
          setNo(props.permit.id);
        }}
      >
        <u>N</u>o
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!data.currentUser.annotator}
        onClick={() => {
          setMaybe(props.permit.id);
        }}
      >
        Maybe
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!data.currentUser.annotator}
        onClick={() => {
          setDuplicate(props.permit.id);
        }}
      >
        Duplicate
      </button>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!data.currentUser.annotator}
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
