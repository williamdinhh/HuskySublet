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

  const handleDelete = (signalId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setSignals((prev) => prev.filter((signal) => signal.id !== signalId));
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🐺 Husky Sublet</h1>
            <p>Find your perfect UW sublet</p>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "browse" ? "active" : ""}`}
            onClick={() => setActiveTab("browse")}
          >
            Explore ({signals.length})
          </button>
          <button
            className={`tab ${activeTab === "post" ? "active" : ""}`}
            onClick={() => setActiveTab("post")}
          >
            List Your Place
          </button>
        </div>

        {activeTab === "browse" ? (
          <SignalList signals={signals} onDelete={handleDelete} />
        ) : (
          <SubmitForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}

export default App;
