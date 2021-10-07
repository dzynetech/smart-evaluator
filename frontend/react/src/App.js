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
    } else {
      //remove old htaccess headers if present
      console.log(headers);
      if (headers && Object.hasOwnProperty('Authorization')) {
        delete headers.Authorization;
      }
      return {
        headers: {
         ...headers 
        }
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
          <Route path="/login">
            <Nav active={"login"} jwt={jwt} setJwt={setJwt} />
            <Login setJwt={setJwt} />
          </Route>
          <Route path="/stats">
            <RequireLogin jwt={jwt} />
            <Nav active={"stats"} jwt={jwt} setJwt={setJwt} />
            <Stats />
          </Route>
          <Route path="/">
            <RequireLogin jwt={jwt} />
            <Permits jwt={jwt} setJwt={setJwt} />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
