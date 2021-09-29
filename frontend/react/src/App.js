import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Stats from "./components/Stats.js";
import Permits from "./components/Permits.js";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createContext } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

var graphql_url = process.env.REACT_APP_GRAPHQL_URL;
if (!graphql_url) {
  graphql_url = "http://" + window.location.host + "/graphql";
}

export const permitContext = createContext(null);

function App() {
  const [jwt, setJwt] = useLocalStorage("jwt", null);

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: jwt ? `Bearer ${jwt}` : "",
      },
    };
  });

  const client = new ApolloClient({
    uri: graphql_url,
    cache: new InMemoryCache(),
    link: authLink,
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/stats">
            <Nav active={"stats"} />
            <Stats />
          </Route>
          <Route path="/annotate">
            <permitContext.Provider value={{ readonly: false }}>
              <Permits />
            </permitContext.Provider>
          </Route>
          <Route path="/">
            <permitContext.Provider value={{ readonly: true }}>
              <Permits />
            </permitContext.Provider>
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
