import "./Login.css";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const AUTH_MUT = gql`
  mutation MyMutation($password: String!, $username: String!) {
    authenticate(input: { username: $username, password: $password }) {
      jwt
    }
  }
`;
function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [getPermits, { loading, error, data }] = useMutation(AUTH_MUT);

  function handleLogin(e) {
    if (e) {
      e.preventDefault();
    }
    getPermits({
      variables: {
        username: username,
        password: password,
      },
    });
  }

  useEffect(() => {
    if (data?.authenticate?.jwt) {
      props.setJwt(data.authenticate.jwt);
    }
  }, [data]);

  return (
    <>
      <div className="text-center login-div">
        <form className="form-signin" onSubmit={handleLogin}>
          <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Username"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-lg btn-primary btn-block" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
