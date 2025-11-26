import React, { useState } from "react";
import {
  NEIGHBORHOODS,
  PRICE_RANGES,
  QUARTERS,
  ROOM_TYPES,
  SIGNAL_TYPES,
} from "../data";

function SubmitForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    type: "offering",
    name: "",
    email: "",
    neighborhood: "",
    priceRange: "",
    quarter: "",
    dates: "",
    roomType: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate UW email
    const emailRegex = /@uw\.edu$/i;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Must be a valid @uw.edu email";
    }

    // Validate required fields
    if (!formData.neighborhood)
      newErrors.neighborhood = "Neighborhood is required";
    if (!formData.priceRange) newErrors.priceRange = "Price range is required";
    if (!formData.quarter) newErrors.quarter = "Quarter is required";
    if (!formData.dates.trim()) newErrors.dates = "Dates are required";
    if (!formData.roomType) newErrors.roomType = "Room type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        ...formData,
        id: Date.now(), // Simple ID generation
      });

      // Reset form
      setFormData({
        type: "offering",
        name: "",
        email: "",
        neighborhood: "",
        priceRange: "",
        quarter: "",
        dates: "",
        roomType: "",
        notes: "",
      });

      alert("Signal posted successfully! 🎉");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Signal Type *</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            {SIGNAL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Name/Alias *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Chen"
            />
            {errors.name && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>UW Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@uw.edu"
            />
            {errors.email && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Neighborhood *</label>
            <select
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
            >
              <option value="">Select neighborhood...</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {errors.neighborhood && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.neighborhood}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Price Range *</label>
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
            >
              <option value="">Select price range...</option>
              {PRICE_RANGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.priceRange && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.priceRange}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quarter *</label>
            <select
              name="quarter"
              value={formData.quarter}
              onChange={handleChange}
            >
              <option value="">Select quarter...</option>
              {QUARTERS.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
            {errors.quarter && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.quarter}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Room Type *</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
            >
              <option value="">Select room type...</option>
              {ROOM_TYPES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.roomType && (
              <span style={{ color: "red", fontSize: "0.9rem" }}>
                {errors.roomType}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Dates *</label>
          <input
            type="text"
            name="dates"
            value={formData.dates}
            onChange={handleChange}
            placeholder="e.g., March 25 - June 10"
          />
          {errors.dates && (
            <span style={{ color: "red", fontSize: "0.9rem" }}>
              {errors.dates}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional details (furnished, pets, parking, etc.)"
          />
        </div>

        <button type="submit" className="submit-btn">
          Post Signal
        </button>
      </form>
    </div>
  );
}

export default SubmitForm;
