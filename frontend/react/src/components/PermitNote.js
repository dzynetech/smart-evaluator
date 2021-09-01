import React, { useState, useEffect, useContext } from "react";
import { useMutation, gql } from "@apollo/client";
import { permitContext } from "../App";
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
  const [updateNote, { data, loading, error }] = useMutation(UPDATE_NOTE);
  const { readonly } = useContext(permitContext);
  const [firstRender, setFirstRender] = useState(true);
  console.log(readonly);
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

  return (
    <div className="form-group">
      <textarea
        className="form-control"
        style={{ width: "95%" }}
        id={"notes-" + props.permit.id}
        rows="2"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={readonly}
      ></textarea>
    </div>
  );
}

export default PermitNote;
