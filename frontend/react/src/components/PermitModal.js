import PermitBox from "./PermitBox.js";

import { useQuery, gql } from "@apollo/client";

import "./PermitModal.css";

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
    }
  }
`;
function PermitModal(props) {
  const { loading, error, data } = useQuery(PERMIT_QUERY, {
    fetchPolicy: "no-cache",
    variables: {
      id: props.permitId,
    },
  });

  console.log(props.permitId);
  if (!data) {
    if (error) {
      console.log(error);
    }
    return <></>;
  }

  return (
    <div
      className="permit-modal"
      onClick={(e) => {
        if (e.target != e.currentTarget) {
          return;
        }
        props.setPermitId(null);
      }}
    >
      <div className="permit-modal-content">
        <span
          class="modal-close"
          onClick={() => {
            props.setPermitId(null);
          }}
        >
          &times;
        </span>
        <PermitBox permit={data.permit} />
      </div>
    </div>
  );
}

export default PermitModal;
