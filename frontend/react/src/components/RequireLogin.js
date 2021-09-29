import { useHistory } from "react-router-dom";
function RequireLogin(props) {
  const history = useHistory();
  if (!props.jwt) {
    history.push("/login");
  }
  return null;
}

export default RequireLogin;
