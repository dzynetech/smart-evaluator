import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import USER_QUERY from "../queries/UserQuery";

interface Props {
  active : string,
  jwt: string | null,
  setJwt: (jwt: string | null)=>void
}

function Nav(props: Props) {
  const history = useHistory();
  const { data } = useQuery(USER_QUERY);

  return (
    <nav id="nav" className="navbar navbar-expand-lg navbar-light bg-light">
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
          {props.jwt && data && (
            <li className="nav-item">
              <a className="nav-link non-interactive" href="#">
                Signed in as {data.currentUser.username}
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
