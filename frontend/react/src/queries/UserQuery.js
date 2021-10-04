import { gql } from "@apollo/client";

const USER_QUERY = gql`
  query UserPerms {
    getUserId
    isAnnotator
  }
`;

export default USER_QUERY;
