
import { gql } from "@apollo/client";

//get a single permit from it's ID
const PERMIT_QUERY = gql`
  query PermitById($id: Int!) {
    permit(id: $id) {
      id
      cost
      city
      sqft
      state
      street
      streetNumber
      source {
        name
      }
      location {
        x
        y
      }
      zip
      permitData
      classification
      issueDate
      notes
      imageUrl
      kmlUrl
      name
    }
  }
`;

export default PERMIT_QUERY 