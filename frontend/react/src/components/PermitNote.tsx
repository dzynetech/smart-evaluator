import React, { useState, useEffect, useContext } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import USER_QUERY from "../queries/UserQuery";
import { Permit } from "../generated/graphql";

interface Props {
  permit: Permit;
}
function PermitNote(props: Props) {
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
  const { data } = useQuery(USER_QUERY);

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

  if (!data) return <></>;
  return (
    <div className="form-group">
      <textarea
        className="form-control"
        id={"notes-" + props.permit.id}
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={!data.currentUser.annotator}
      ></textarea>
    </div>
  );
}

export default PermitNote;
