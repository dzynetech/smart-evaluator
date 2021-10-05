import { gql, useQuery, useLazyQuery } from "@apollo/client";

const PERMIT_NAME_QUERY = gql`
  query PermitName($id: Int!) {
    permit(id: $id) {
      name
    }
  }
`;

export async function setTooltip(marker, id, apolloClient) {
  const data = await apolloClient.query({
    query: PERMIT_NAME_QUERY,
    variables: {
      id: id,
    },
  });
  const name = data.data.permit.name;
  marker.bindTooltip(name, {
    direction: "right",
  });
}
