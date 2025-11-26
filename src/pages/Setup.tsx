import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api, UserPreferences } from '../utils/api';
import './Auth.css';

export default function Setup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    priceRange: {
      min: 500,
      max: 2000,
    },
    numRoommates: 'Any',
    preferredGenders: ['Any'],
    preferredLocations: [],
  });

  const neighborhoods = ['U-District', 'Capitol Hill', 'Northgate', 'Other'];
  const genders = ['Male', 'Female', 'Non-binary', 'Any'];

  const handleLocationToggle = (location: string) => {
    setPreferences((prev) => {
      const locations = prev.preferredLocations || [];
      const updated = locations.includes(location)
        ? locations.filter((l) => l !== location)
        : [...locations, location];
      return { ...prev, preferredLocations: updated };
    });
  };

  const handleGenderToggle = (gender: string) => {
    setPreferences((prev) => {
      const genders = prev.preferredGenders || [];
      if (gender === 'Any') {
        return { ...prev, preferredGenders: ['Any'] };
      }
      const updated = genders.includes(gender)
        ? genders.filter((g) => g !== gender)
        : [...genders.filter((g) => g !== 'Any'), gender];
      return { ...prev, preferredGenders: updated.length > 0 ? updated : ['Any'] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user: updatedUser } = await api.updatePreferences(preferences);
      updateUser(updatedUser);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Set Your Preferences</h1>
        <p className="auth-subtitle">Help us find the perfect sublet for you</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Price Range: ${preferences.priceRange?.min} - ${preferences.priceRange?.max}</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="range"
                min="500"
                max="2000"
                step="50"
                value={preferences.priceRange?.max || 2000}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    priceRange: {
                      min: preferences.priceRange?.min || 500,
                      max: Number(e.target.value),
                    },
                  })
                }
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Number of Roommates</label>
            <select
              value={preferences.numRoommates}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  numRoommates: e.target.value as any,
                })
              }
              style={{
                padding: '12px 16px',
                border: '1px solid var(--hinge-border, #e5e5ea)',
                borderRadius: '10px',
                fontSize: '1rem',
                background: 'var(--hinge-white, #fffffd)',
              }}
            >
              <option value="0">0 (Studio/Private)</option>
              <option value="1">1 Roommate</option>
              <option value="2">2 Roommates</option>
              <option value="3+">3+ Roommates</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Roommate Genders</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {genders.map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => handleGenderToggle(gender)}
                  className={`preference-chip ${
                    preferences.preferredGenders?.includes(gender) ? 'active' : ''
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Preferred Locations</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {neighborhoods.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => handleLocationToggle(location)}
                  className={`preference-chip ${
                    preferences.preferredLocations?.includes(location) ? 'active' : ''
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="auth-button"
            style={{
              background: 'transparent',
              color: 'var(--hinge-gray, #8e8e93)',
              border: '1px solid var(--hinge-border, #e5e5ea)',
            }}
            disabled={loading}
          >
            Skip for Now
          </button>
        </form>
      </div>
    </div>
  );
}

// Add to Auth.css
const style = document.createElement('style');
style.textContent = `
  .preference-chip {
    padding: 8px 16px;
    border: 1px solid var(--hinge-border, #e5e5ea);
    border-radius: 20px;
    background: var(--hinge-white, #fffffd);
    color: var(--hinge-black, #1a1a1a);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .preference-chip:hover {
    border-color: var(--hinge-black, #1a1a1a);
  }

  .preference-chip.active {
    background: var(--hinge-black, #1a1a1a);
    color: var(--hinge-white, #fffffd);
    border-color: var(--hinge-black, #1a1a1a);
  }
`;
document.head.appendChild(style);
