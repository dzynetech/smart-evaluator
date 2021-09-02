import React from "react";

function PermitDataTable(props) {
  function CleanPermitData(json_data) {
    var data = JSON.parse(json_data);
    let unneeded = [
      "Accuracy Score",
      "Accuracy Type",
      "Bldg Sqft",
      "City",
      "County",
      "Country",
      "Estimated Construction Cost",
      "Issue Date",
      "Latitude",
      "Longitude",
      "Number",
      "Site Location",
      "Source",
      "State",
      "Street",
      "Unit Type",
      "Unit Number",
      "Zip",
    ];
    unneeded.forEach((x) => {
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
