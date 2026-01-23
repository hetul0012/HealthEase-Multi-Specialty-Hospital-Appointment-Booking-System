import { useEffect, useState } from "react";
import axios from "axios";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState("");

  // Backend connection test
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((res) => setMsg(res.data))
      .catch(() => setMsg("Backend not connected"));
  }, []);

  return (
    <>
      {/* Logos */}
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Title */}
      <h1>HealthEase</h1>

      {/* Backend Status */}
      <p style={{ fontWeight: "bold", color: "green" }}>{msg}</p>

      {/* Counter Card */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
