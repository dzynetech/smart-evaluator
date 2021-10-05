import React, { useState, useEffect, useContext } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { permitContext } from "../App";
import USER_QUERY from "../queries/UserQuery";

function PermitNote(props) {
  const UPDATE_NOTE = gql`
    mutation UpdateNotes($note: String, $id: Int!) {
      updatePermit(input: { patch: { notes: $note }, id: $id }) {
        clientMutationId
        permit {
          notes
        }
      }
    }
  `;
  const [note, setNote] = useState(props.permit.notes || "");
  const [updateNote, { error }] = useMutation(UPDATE_NOTE);
  const [firstRender, setFirstRender] = useState(true);
  const { data: user_data } = useQuery(USER_QUERY);

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    updateNote({
      variables: {
        note: note,
        id: props.permit.id,
      },
    });
  }, [note]);

  if (error) console.log(error);

  if (!user_data) return "";
  return (
    <div className="form-group">
      <textarea
        className="form-control"
        id={"notes-" + props.permit.id}
        rows="2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={!user_data.isAnnotator}
      ></textarea>
    </div>
  );
}

export default PermitNote;
