import React from "react";
import { useMutation, gql, ApolloProvider } from "@apollo/client";

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

const colors = {
  UNCLASSIFIED: {
    border: "8px solid #EEE",
    backgroundColor: "#FFFFFF",
  },
  CONSTRUCTION: {
    border: "8px solid #00CC00",
    backgroundColor: "#CCFFCC",
  },
  NOT_CONSTRUCTION: {
    border: "8px solid #FF0000",
    backgroundColor: "#FFCCCC",
  },
  POSSIBLE_CONSTRUCTION: {
    border: "8px solid #DDDD00",
    backgroundColor: "#FFFF99",
  },
  DUPLICATE: {
    border: "8px solid #FF0000",
    backgroundColor: "#FFCCCC",
  },
  HIGHLIGHT: {
    border: "8px solid #999",
    backgroundColor: "#EEEEEE",
  },
};
function PermitButtons(props) {
  const [classifyPermit, { data, loading, error }] =
    useMutation(CLASSIFY_PERMIT_MUT);

  async function classify(classification) {
    classifyPermit({
      variables: {
        id: props.permit.id,
        classification: classification,
      },
    });
  }

  function setYes(id) {
    document.getElementById(id).style.border = colors.CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.CONSTRUCTION.backgroundColor;
    classify("CONSTRUCTION");
  }

  function setNo(id) {
    document.getElementById(id).style.border = colors.NOT_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.NOT_CONSTRUCTION.backgroundColor;
    classify("NOT_CONSTRUCTION");
  }

  function setMaybe(id) {
    document.getElementById(id).style.border =
      colors.POSSIBLE_CONSTRUCTION.border;
    document.getElementById(id).style.backgroundColor =
      colors.POSSIBLE_CONSTRUCTION.backgroundColor;
    classify("POSSIBLE_CONSTRUCTION");
  }

  function setDuplicate(id) {
    document.getElementById(id).style.border = colors.DUPLICATE.border;
    document.getElementById(id).style.backgroundColor =
      colors.DUPLICATE.backgroundColor;
    classify("DUPLICATE");
  }

  function setUnclassified(id) {
    document.getElementById(id).style.border = colors.UNCLASSIFIED.border;
    document.getElementById(id).style.backgroundColor =
      colors.UNCLASSIFIED.backgroundColor;
    classify("UNCLASSIFIED");
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setNo(props.permit.id);
        }}
      >
        <u>N</u>o
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setYes(props.permit.id);
        }}
      >
        <u>Y</u>es
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setMaybe(props.permit.id);
        }}
      >
        Maybe
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setDuplicate(props.permit.id);
        }}
      >
        Duplicate
      </button>
      <button
        type="button"
        className="btn btn-primary"
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
