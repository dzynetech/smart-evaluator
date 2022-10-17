import React from "react";
import { Permit } from "../generated/graphql";
import ignoredPermitData from "../utils/IgnoredPermitData";

interface Props {
  permit: Permit;
}

function PermitDataTable(props: Props) {
  function CleanPermitData(json_data: string) {
    var data = JSON.parse(json_data);
    ignoredPermitData.forEach((x) => {
      delete data[x];
    });
    return data;
  }

  return (
    <div>
      {props.permit.permitData &&
        Object.entries(CleanPermitData(props.permit.permitData)).map(
          ([key, value]) => (
            <React.Fragment key={key}>
              <b>{key}:</b> { typeof value === "string" ? value : JSON.stringify(value)}
              <br />
            </React.Fragment>
          )
        )}
    </div>
  );
}

export default PermitDataTable;
