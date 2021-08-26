import logo from './logo.svg';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

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

const SOURCES_QUERY = gql`
  query GetAllSources {
    sources {
      nodes {
        description
        id
        name
      }
    }
  }
`;

const TOTAL_QUERY = gql`
  query TotalPermits($sourceId: Int) {
    permits(condition: { sourceId: $sourceId }) {
      totalCount
    }
  }
`;

const CLASSIFICATION_QUERY = gql`
  query TotalPermits($sourceId: Int, $classification: Classification) {
    permits(
      condition: { sourceId: $sourceId, classification: $classification }
    ) {
      totalCount
    }
  }
`;

function Permit() {
  const { loading, error, data } = useQuery(PERMIT_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return JSON.stringify(data.permit);
}

function Stats() {
  const { loading, error, data } = useQuery(SOURCES_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {data.sources.nodes.map((n) => (
        <SourceStats source={n} />
      ))}
    </>
  );
}

function SourceStats(props) {
  const sourceId = props.source.id;
  const total = useQuery(TOTAL_QUERY, {
    variables: { sourceId },
  });
  const unclassified = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "UNCLASSIFIED" },
  });
  const construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "CONSTRUCTION" },
  });
  const not_construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "NOT_CONSTRUCTION" },
  });
  const possible_construction = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "POSSIBLE_CONSTRUCTION" },
  });
  const duplicate = useQuery(CLASSIFICATION_QUERY, {
    variables: { sourceId: sourceId, classification: "DUPLICATE" },
  });

  if (total.loading) return <p>Loading...</p>;
  if (total.error) return <p>Error with Total</p>;
  if (unclassified.loading) return <p>Loading...</p>;
  if (unclassified.error) return <p>Error with unclassified</p>;
  if (construction.loading) return <p>Loading...</p>;
  if (construction.error) return <p>Error with consruction</p>;
  if (not_construction.loading) return <p>Loading...</p>;
  if (not_construction.error) return <p>Error with not consruction</p>;
  if (possible_construction.loading) return <p>Loading...</p>;
  if (possible_construction.error)
    return <p>Error with possible consruction</p>;
  if (duplicate.loading) return <p>Loading...</p>;
  if (duplicate.error) return <p>Error with duplicate</p>;

  return (
    <>
      <h2>{props.source.name}</h2>
      <p>Permits: {total.data.permits.totalCount}</p>
      <p>Unclassified: {unclassified.data.permits.totalCount}</p>
      <p>Construction: {construction.data.permits.totalCount}</p>
      <p>Not Construction: {not_construction.data.permits.totalCount}</p>
      <p>
        Possible Construction: {possible_construction.data.permits.totalCount}
      </p>
      <p>Duplicate: {duplicate.data.permits.totalCount}</p>
    </>
  );
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
