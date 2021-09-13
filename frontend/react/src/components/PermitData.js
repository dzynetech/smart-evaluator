import React from "react";
import ignoredPermitData from "../utils/IgnoredPermitData.js";

function PermitDataTable(props) {
  function CleanPermitData(json_data) {
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
              <b>{key}:</b> {value}
              <br />
            </React.Fragment>
          )
        )}
    </div>
  );
}

export default PermitDataTable;
