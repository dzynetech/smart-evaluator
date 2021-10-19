import { useHistory } from "react-router-dom";

interface Props {
  jwt : string | null
}

function RequireLogin(props : Props) {
  const history = useHistory();
  if (!props.jwt) {
    history.push("/login");
  }
  return null;
}

export default RequireLogin;
