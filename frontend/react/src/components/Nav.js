function Nav(props) {
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
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
