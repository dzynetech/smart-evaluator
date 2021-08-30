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
    <table
      className="col-lg-3 col-md-auto permitDataTable"
      style={{ border: props.border, backgroundColor: props.backgroundColor }}
    >
      <tbody>
        <tr>
          <td>
            <h5>Permit Data</h5>
          </td>
        </tr>
        <tr>
          <td>
            {props.permit.permitData &&
              Object.entries(CleanPermitData(props.permit.permitData)).map(
                ([key, value]) => (
                  <React.Fragment key={key}>
                    <b>{key}:</b> {value}
                    <br />
                  </React.Fragment>
                )
              )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default PermitDataTable;
