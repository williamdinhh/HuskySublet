import React, { useState } from "react";
import { NEIGHBORHOODS, PRICE_RANGES, QUARTERS } from "../data";

function SignalList({ signals }) {
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
          <p>No signals found matching your filters.</p>
          <p>Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="signals-grid">
          {filteredSignals.map((signal) => (
            <div key={signal.id} className={`signal-card ${signal.type}`}>
              <div className="signal-header">
                <div className="signal-name">{signal.name}</div>
                <span className={`signal-type-badge ${signal.type}`}>
                  {signal.type === "offering" ? "🏠 Offering" : "🔍 Looking"}
                </span>
              </div>

              <div className="signal-detail">
                <strong>Neighborhood:</strong> {signal.neighborhood}
              </div>

              <div className="signal-detail">
                <strong>Price:</strong> {signal.priceRange}
              </div>

              <div className="signal-detail">
                <strong>Quarter:</strong> {signal.quarter}
              </div>

              <div className="signal-detail">
                <strong>Dates:</strong> {signal.dates}
              </div>

              <div className="signal-detail">
                <strong>Room Type:</strong> {signal.roomType}
              </div>

              {signal.notes && (
                <div className="signal-notes">"{signal.notes}"</div>
              )}

              <div
                className="signal-detail"
                style={{ marginTop: "1rem", fontSize: "0.9rem" }}
              >
                <strong>Contact:</strong> {signal.email}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SignalList;
