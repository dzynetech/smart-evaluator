import React, { useState, useEffect } from "react";
import { useMutation, gql, ApolloProvider } from "@apollo/client";

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
  useEffect(() => {
    updateNote({
      variables: {
        note: note,
        id: props.permit.id,
      },
    });
  }, [note]);

  if (error) console.log(error);
  // if (data) console.log(data);

  return (
    <div className="form-group">
      <textarea
        className="form-control"
        style={{ width: "100%" }}
        id={"notes-" + props.permit.id}
        rows="2"
        placeholder="Enter a note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
    </div>
  );
}

export default PermitNote;
