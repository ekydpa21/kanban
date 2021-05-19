import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const login = (e) => {
    e.preventDefault();
    axios
      .post("https://new-kanbans.herokuapp.com/login", input)
      .then(({ data }) => {
        localStorage.setItem("access_token", data.access_token);
      })
      .catch(console.log);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push("/");
    }, 5000);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <p className="title">Login</p>
        <form>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              id="floatingInput"
              value={input.email}
              onChange={handleChange}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              id="floatingPassword"
              value={input.password}
              onChange={handleChange}
              autoComplete="none"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
        </form>
        <button className="btn btn-primary" onClick={login}>
          Login
        </button>
        <div className="footer">
          <p>Don't have any account ?</p>
          <Link to="/register">Register Here.</Link>
        </div>
      </div>
    </div>
  );
}
