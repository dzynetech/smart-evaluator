import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import USER_QUERY from "../queries/UserQuery";
import { useEffect, useState } from "react";
import { PlusIcon as PlusIconMini } from "@heroicons/react/solid";
import QuittableModal from "./QuitableModal";
import IngestForm from "./IngestForm";
import Ingest from "./Ingest";

interface Props {
  active: string;
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
}

function Nav(props: Props) {
  const history = useHistory();
  const { data, error } = useQuery(USER_QUERY);

  const [showModal, setShowModal] = useState(false)

  // redirect on expired JWT
  useEffect(() => {
    if (error?.message.includes("status code 401")) {
      localStorage.clear();
      history.push("/login");
      window.location.reload();
    }
  }, [error]);

  return (
    <>
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
              className={
                "nav-item " + (props.active === "stats" ? "active" : "")
              }
            >
              <a className="nav-link" href="/stats">
                Stats
              </a>
            </li>
          </ul>
          {/* right menu  */}
          <ul className="navbar-nav">
            {props.jwt && data?.currentUser?.username && (
              <button
                type="button"
                className="mr-2 inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={()=>setShowModal(true)}
              >
                <PlusIconMini
                  className="-ml-0.5 mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                Import
              </button>
            )}
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
      <QuittableModal open={showModal} setOpen={setShowModal}>
        <h3 className="text-center">Data Ingest</h3>
        <div className="mx-auto max-w-sm">
          <Ingest/>
        </div>
      </QuittableModal>
    </>
  );
}

export default Nav;
