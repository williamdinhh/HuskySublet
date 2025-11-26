import React, { useState } from "react";
import "./App.css";
import SubmitForm from "./components/SubmitForm";
import SignalList from "./components/SignalList";
import { mockSignals } from "./data";

function App() {
  const [activeTab, setActiveTab] = useState("browse");
  const [signals, setSignals] = useState(mockSignals);

  const handleSubmit = (newSignal) => {
    setSignals((prev) => [newSignal, ...prev]);
    setActiveTab("browse"); // Switch to browse after posting
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🐺 Husky Sublet Signal</h1>
        <p>Quick sublet posting and browsing for UW students</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            Browse Signals ({signals.length})
          </button>
          <button
            className={`tab ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            Post a Signal
          </button>
        </div>

        {activeTab === "browse" ? (
          <SignalList signals={signals} />
        ) : (
          <SubmitForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}

export default App;
