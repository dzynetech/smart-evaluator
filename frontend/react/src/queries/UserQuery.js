import { gql } from "@apollo/client";

const USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      annotator
    }
  }
`;

export default USER_QUERY;
