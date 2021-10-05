import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from "react-router-dom";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import USER_QUERY from "../queries/UserQuery";
import { useEffect } from "react";

const ACCOUNT_QUERY = gql`
  query UsernameQuery($id: Int!) {
    user(id: $id) {
      username
    }
  }
`;

function Nav(props) {
  const history = useHistory();
  const { loading, error, data: user_data } = useQuery(USER_QUERY);
  const [
    getUsername,
    { loading: username_loading, error: username_error, data: username_data },
  ] = useLazyQuery(ACCOUNT_QUERY);

  useEffect(() => {
    if (user_data?.getUserId) {
      getUsername({
        variables: {
          id: user_data.getUserId,
        },
      });
    }
  }, [user_data]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        SMART Site Evaluator
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
        {/* left menu  */}
        <ul className="navbar-nav">
          <li
            className={
              "nav-item " + (props.active === "classify" ? "active" : "")
            }
          >
            <a className="nav-link" href="/">
              Classify
            </a>
          </li>
          <li
            className={"nav-item " + (props.active === "stats" ? "active" : "")}
          >
            <a className="nav-link" href="/stats">
              Stats
            </a>
          </li>
        </ul>
        {/* right menu  */}
        <ul className="navbar-nav">
          {props.jwt && username_data && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                Signed in as {username_data.user.username}
              </a>
            </li>
          )}
          {props.jwt && (
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => {
                  props.setJwt(null);
                  history.push("/login");
                }}
              >
                Log Out
              </a>
            </li>
          )}
          {!props.jwt && (
            <li
              className={
                "nav-item " + (props.active === "login" ? "active" : "")
              }
            >
              <a className="nav-link" href="/login">
                Login
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
