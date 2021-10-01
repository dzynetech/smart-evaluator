import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Stats from "./components/Stats.js";
import Permits from "./components/Permits.js";
import Nav from "./components/Nav";
import Login from "./components/Login";
import RequireLogin from "./components/RequireLogin";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createContext } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { graphql } from "graphql";

var graphql_url = process.env.REACT_APP_GRAPHQL_URL;
if (!graphql_url) {
  graphql_url = "http://" + window.location.host + "/graphql";
}

export const permitContext = createContext(null);

function App() {
  const [jwt, setJwt] = useLocalStorage("jwt", null);
  const httpLink = createHttpLink({
    uri: graphql_url,
  });

  const authLink = setContext((_, { headers }) => {
    if (jwt) {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${jwt}`,
        },
      };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/stats">
            <RequireLogin jwt={jwt} />
            <Nav active={"stats"} jwt={jwt} setJwt={setJwt} />
            <Stats />
          </Route>
          <Route path="/annotate">
            <RequireLogin jwt={jwt} />
            <permitContext.Provider value={{ readonly: false }}>
              <Permits jwt={jwt} setJwt={setJwt} />
            </permitContext.Provider>
          </Route>
          <Route path="/imerit_sites">
            <RequireLogin jwt={jwt} />
            <permitContext.Provider value={{ readonly: false }}>
              <Permits jwt={jwt} setJwt={setJwt} hasBounds={true} />
            </permitContext.Provider>
          </Route>
          <Route path="/login">
            <Nav active={"login"} jwt={jwt} setJwt={setJwt} />
            <Login setJwt={setJwt} />
          </Route>
          <Route path="/">
            <RequireLogin jwt={jwt} />
            <permitContext.Provider value={{ readonly: true }}>
              <Permits jwt={jwt} setJwt={setJwt} />
            </permitContext.Provider>
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
