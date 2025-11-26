import React, { useState } from "react";
import { NEIGHBORHOODS, PRICE_RANGES, QUARTERS } from "../data";

function SignalList({ signals, onDelete }) {
  const [filters, setFilters] = useState({
    quarter: "",
    priceRange: "",
    neighborhood: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter signals based on selected filters
  const filteredSignals = signals.filter((signal) => {
    if (filters.quarter && signal.quarter !== filters.quarter) return false;
    if (filters.priceRange && signal.priceRange !== filters.priceRange)
      return false;
    if (filters.neighborhood && signal.neighborhood !== filters.neighborhood)
      return false;
    return true;
  });

  return (
    <div>
      <div className="filters">
        <div className="filter-group">
          <div>
            <label>Quarter</label>
            <select
              name="quarter"
              value={filters.quarter}
              onChange={handleFilterChange}
            >
              <option value="">All Quarters</option>
              {QUARTERS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Price Range</label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">All Prices</option>
              {PRICE_RANGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Neighborhood</label>
            <select
              name="neighborhood"
              value={filters.neighborhood}
              onChange={handleFilterChange}
            >
              <option value="">All Neighborhoods</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredSignals.length === 0 ? (
        <div className="no-results">
          <p>No listings found</p>
          <p>Try adjusting your filters to see more results</p>
        </div>
      ) : (
        <div className="signals-grid">
          {filteredSignals.map((signal) => (
            <div key={signal.id} className={`signal-card ${signal.type}`}>
              <div className="signal-card-image">
                {signal.type === "offering" ? "🏠" : "🔍"}
              </div>
              <div className="signal-card-content">
                <div className="signal-header">
                  <div>
                    <div className="signal-name">{signal.name}</div>
                    <div className="signal-location">
                      📍 {signal.neighborhood}
                    </div>
                  </div>
                  <span className={`signal-type-badge ${signal.type}`}>
                    {signal.type === "offering" ? "Available" : "Seeking"}
                  </span>
                </div>

                <div className="signal-price">{signal.priceRange}</div>
                <div className="signal-dates">📅 {signal.dates}</div>

                <div className="signal-detail">
                  <strong>Room:</strong> {signal.roomType}
                </div>

                <div className="signal-detail">
                  <strong>Quarter:</strong> {signal.quarter}
                </div>

                {signal.notes && (
                  <div className="signal-notes">{signal.notes}</div>
                )}

                <div className="signal-contact">
                  <strong>✉️</strong> {signal.email}
                </div>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(signal.id)}
                  title="Delete this listing"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SignalList;
