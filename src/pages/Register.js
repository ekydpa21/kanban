import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [input, setInput] = useState({ name: "", email: "", password: "" });
  const history = useHistory();

  const handleChange = (e) => {
    let { name, value } = e.target;
    const newInput = { ...input, [name]: value };
    setInput(newInput);
  };

  const register = (e) => {
    e.preventDefault();
    axios
      .post("https://new-kanbans.herokuapp.com/register", input)
      .then(({ data }) => {
        if (data) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(console.log);

    history.push("/");
  };
  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <p className="title">Register</p>
        <form>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              id="floatingInputName"
              value={input.name}
              onChange={handleChange}
            />
            <label htmlFor="floatingInputName">Name</label>
          </div>
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
        <button className="btn btn-primary" onClick={register}>
          Register
        </button>
        <div className="footer">
          <p>Already have any account ?</p>
          <Link to="/login">Login Here.</Link>
        </div>
      </div>
    </div>
  );
}
