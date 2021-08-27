import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

import Stats from "./components/Stats";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const PERMIT_QUERY = gql`
  query MyQuery {
    nodeId
    permit(id: 75988) {
      id
    }
  }
`;

function Permit() {
  const { loading, error, data } = useQuery(PERMIT_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return JSON.stringify(data.permit);
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App container-fluid">
        <Stats />
      </div>
    </ApolloProvider>
  );
}

export default App;
