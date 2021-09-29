import useLocalStorage from "../hooks/useLocalStorage";
import { useHistory } from "react-router-dom";

function Nav(props) {
  const history = useHistory();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        SMART Site Evaluator
      </a>
      <div className="collapse navbar-collapse" id="navbarNav">
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
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
