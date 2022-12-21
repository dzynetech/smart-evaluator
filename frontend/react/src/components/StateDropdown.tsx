import { useQuery, gql } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { Permit } from "../generated/graphql";

const STATES_QUERY = gql`
  query AllStates {
    permits(filter: { imageUrl: { isNull: false } }) {
      nodes {
        state
      }
    }
  }
`;
interface Props {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

function StateDropdown(props: Props) {
  const { data } = useQuery(STATES_QUERY);
  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      var states = new Set<string>()
      var permits: Permit[] = data.permits.nodes;
      var x = [...new Set(permits)];
      x.forEach((obj) => {
        if (obj && obj.state) {
          states.add(obj.state!);
        }
      });
      setStates([...states].sort())
    }
  }, [data]);

  return (
    <select
      className="custom-select my-1 mr-sm-2"
      id="stateFilter"
      value={props.state}
      onChange={(e) => {
        props.setState(e.target.value);
      }}
    >
      <option value="">All</option>
      {states &&
        states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
    </select>
  );
}
export default StateDropdown;
