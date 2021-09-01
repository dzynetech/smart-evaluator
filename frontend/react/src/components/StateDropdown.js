import { useQuery, gql } from "@apollo/client";
import { useState, useEffect } from "react";

const STATES_QUERY = gql`
  query AllStates {
    permits {
      nodes {
        state
      }
    }
  }
`;

function StateDropdown(props) {
  const { loading, error, data } = useQuery(STATES_QUERY);
  const [states, setStates] = useState([]);

  useEffect(() => {
    if (data) {
      var states = [];
      var x = [...new Set(data.permits.nodes)];
      x.forEach((obj) => {
        if (obj) {
          states.push(obj.state);
        }
      });
      states.sort();
      setStates(states);
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
      {states && states.map((state) => <option value={state}>{state}</option>)}
    </select>
  );
}
export default StateDropdown;
