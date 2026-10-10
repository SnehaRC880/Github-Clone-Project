import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { useAuth } from '../../authContext'

import { PageHeader } from '@primer/react/experimental';
import { Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {

  // useEffect(() => {       //is user is not logged in and wants to logged in and if suppose user has logout and come to logged in page
  //    localStorage.removeItem("token");
  //    localStorage.removeItem("userId");
  //    setCurrentUser(null);         //currently nobody id loggedin
  // }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const {setCurrentUser} = useAuth();

  const handleLogin =  async(e) => {   //e - login event is triggered

     e.preventDefault();

    try {  

     setLoading(true); 
       const res = await axios.post("http://localhost:3000/login", {
      email: email,               
      password: password
    });

    const token = res.data.token;     //during login the backend will be returning the token and userId which will be stored in localstorage
    const userId = res.data.userId;       //somebody is signup that means they are login also
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId); //(key ,value) pair

    setCurrentUser(userId);
    setLoading(false);

    window.location.href = '/'; //navigate can be use

  } catch(err) {
    console.error(err);
    alert("Login Falied!");
    setLoading(false);
  }
} 

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <div sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Sign In</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </div>
        </div>
        <div className="login-box">
          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading} 
            onClick={handleLogin}
          >
           { loading ? "Loading..." : "Login" }
          </Button>
        </div>
        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


//to check local storage go on inspect and then application