import React, { useState } from "react";
import App from "./Todo"; // TODO app
import Login from "./Login";
import Signup from "./Signup";

const Dashboard = () => {
  const [token, setToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const toggleSignup = () => setShowSignup(!showSignup);

  return (
    <div>
      {token ? (
        <div>
          <h2>Welcome to the Dashboard</h2>
          <App />
        </div>
      ) : (
        <div>
          {showSignup ? (
            <Signup />
          ) : (
            <Login onLogin={(userToken) => setToken(userToken)} />
          )}
          <button onClick={toggleSignup}>
            {showSignup ? "Switch to Login" : "Switch to Signup"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
