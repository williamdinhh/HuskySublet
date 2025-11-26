import { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";

// ============================================================================
// DATA MODEL & TYPES
// ============================================================================

type Neighborhood = "U-District" | "Capitol Hill" | "Northgate" | "Other";

interface Sublet {
  id: string;
  title: string;
  price: number;
  neighborhood: Neighborhood;
  startDate: string;
  endDate: string;
  vibes: string[];
  promptQuestion: string;
  promptAnswer: string;
  email: string;
}

// ============================================================================
// SAMPLE DATA - Hard-coded sublets for demo
// ============================================================================

const SAMPLE_SUBLETS: Sublet[] = [
  {
    id: "1",
    title: "3-bed near U-District – Summer sublet",
    price: 950,
    neighborhood: "U-District",
    startDate: "2024-06-15",
    endDate: "2024-08-31",
    vibes: ["Quiet", "Clean", "Pet-friendly"],
    promptQuestion: "What makes this place special?",
    promptAnswer:
      "Right next to campus with a rooftop view of Mount Rainier. Plus, my cat Oliver will be here to greet you!",
    email: "alex.chen@uw.edu",
  },
  {
    id: "2",
    title: "Cozy studio in Capitol Hill",
    price: 1200,
    neighborhood: "Capitol Hill",
    startDate: "2024-07-01",
    endDate: "2024-09-15",
    vibes: ["Social", "Modern", "Near nightlife"],
    promptQuestion: "Perfect roommate is...",
    promptAnswer:
      "Someone who loves exploring local coffee shops and doesn't mind the occasional house party! Weekend brunch enthusiast a plus.",
    email: "sarah.m@uw.edu",
  },
  {
    id: "3",
    title: "Shared house with backyard - Northgate",
    price: 750,
    neighborhood: "Northgate",
    startDate: "2024-06-01",
    endDate: "2024-08-20",
    vibes: ["Chill", "Spacious", "Backyard"],
    promptQuestion: "What's your ideal weekend?",
    promptAnswer:
      "BBQs in the backyard, board game nights, and walks to the light rail. We're pretty low-key but always down to hang.",
    email: "mike.johnson@uw.edu",
  },
  {
    id: "4",
    title: "Private room - walking distance to UW",
    price: 850,
    neighborhood: "U-District",
    startDate: "2024-05-25",
    endDate: "2024-09-01",
    vibes: ["Quiet", "Study-friendly", "Furnished"],
    promptQuestion: "What are you looking for in a subletter?",
    promptAnswer:
      "A quiet, responsible student. I have finals so need someone respectful of study time. Fully furnished with a desk!",
    email: "emily.wang@uw.edu",
  },
  {
    id: "5",
    title: "Loft apartment with skyline views",
    price: 1400,
    neighborhood: "Capitol Hill",
    startDate: "2024-06-10",
    endDate: "2024-08-25",
    vibes: ["Modern", "Bright", "Gym access"],
    promptQuestion: "Three things to know about this place",
    promptAnswer:
      "1) Floor-to-ceiling windows 2) Building has a gym and rooftop deck 3) Walking distance to Pike Place Market",
    email: "david.kim@uw.edu",
  },
  {
    id: "6",
    title: "Room in grad student house",
    price: 800,
    neighborhood: "U-District",
    startDate: "2024-06-20",
    endDate: "2024-09-10",
    vibes: ["Academic", "Collaborative", "Plant-filled"],
    promptQuestion: "What's the vibe of the house?",
    promptAnswer:
      "PhD students in STEM fields. Lots of late-night study sessions, espresso machine always running, and indoor plants everywhere.",
    email: "lisa.patel@uw.edu",
  },
  {
    id: "7",
    title: "Basement suite with private entrance",
    price: 900,
    neighborhood: "Northgate",
    startDate: "2024-07-01",
    endDate: "2024-08-31",
    vibes: ["Private", "Peaceful", "Parking included"],
    promptQuestion: "Best part about living here?",
    promptAnswer:
      "Total privacy with your own entrance and parking spot. Plus, the landlord upstairs makes amazing cookies and shares them!",
    email: "james.lee@uw.edu",
  },
  {
    id: "8",
    title: "Artist's loft near Pike Place",
    price: 1100,
    neighborhood: "Other",
    startDate: "2024-06-15",
    endDate: "2024-09-05",
    vibes: ["Creative", "Unique", "Natural light"],
    promptAnswer:
      "Exposed brick, huge windows, and an artsy neighborhood. I'm a painter so there's lots of natural light and creative energy.",
    promptQuestion: "What's your space like?",
    email: "maya.rodriguez@uw.edu",
  },
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

function App() {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------

  // Filter states
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<string>("All");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  // Current card index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Liked sublets (stores IDs)
  const [likedSublets, setLikedSublets] = useState<string[]>([]);

  // Show email on current card after clicking "Interested"
  const [showEmail, setShowEmail] = useState<boolean>(false);

  // View mode: 'browse' or 'saved'
  const [viewMode, setViewMode] = useState<"browse" | "saved">("browse");

  // Simple swipe/drag state
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [swipeClass, setSwipeClass] = useState<
    "" | "swipe-left" | "swipe-right"
  >("");
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const dragXRef = useRef<number>(0);

  // ----------------------------------------------------------------------------
  // FILTERED SUBLETS - Compute based on filters
  // ----------------------------------------------------------------------------

  const filteredSublets = useMemo(() => {
    return SAMPLE_SUBLETS.filter((sublet) => {
      // Price filter
      if (sublet.price > maxPrice) return false;

      // Neighborhood filter
      if (
        selectedNeighborhood !== "All" &&
        sublet.neighborhood !== selectedNeighborhood
      ) {
        return false;
      }

      // Vibe filter (sublet must have at least one selected vibe)
      if (selectedVibes.length > 0) {
        const hasMatchingVibe = selectedVibes.some((vibe) =>
          sublet.vibes.includes(vibe)
        );
        if (!hasMatchingVibe) return false;
      }

      return true;
    });
  }, [maxPrice, selectedNeighborhood, selectedVibes]);

  // Current sublet being displayed
  const currentSublet = filteredSublets[currentIndex];

  // ----------------------------------------------------------------------------
  // VIBE OPTIONS - Extract all unique vibes from sample data
  // ----------------------------------------------------------------------------

  const allVibes = useMemo(() => {
    const vibeSet = new Set<string>();
    SAMPLE_SUBLETS.forEach((sublet) => {
      sublet.vibes.forEach((vibe) => vibeSet.add(vibe));
    });
    return Array.from(vibeSet).sort();
  }, []);

  // ----------------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------------

  const handlePass = () => {
    setShowEmail(false);
    if (currentIndex < filteredSublets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(filteredSublets.length); // Show "no more" message
    }
  };

  const handleInterested = () => {
    if (currentSublet) {
      // Add to liked list
      if (!likedSublets.includes(currentSublet.id)) {
        setLikedSublets([...likedSublets, currentSublet.id]);
      }
      // Show email
      setShowEmail(true);

      // Optional: Auto-advance after a moment so user can see the email
      setTimeout(() => {
        setShowEmail(false);
        if (currentIndex < filteredSublets.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(filteredSublets.length);
        }
      }, 2000);
    }
  };

  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleRemoveFromSaved = (id: string) => {
    setLikedSublets(likedSublets.filter((subletId) => subletId !== id));
  };

  // Get full sublet objects for saved view
  const savedSubletsList = SAMPLE_SUBLETS.filter((sublet) =>
    likedSublets.includes(sublet.id)
  );

  // Reset to first card when filters change
  const resetToStart = () => {
    setCurrentIndex(0);
    setShowEmail(false);
    setDragX(0);
    setIsDragging(false);
    setSwipeClass("");
  };

  // Keyboard shortcuts: Left = Pass, Right = Interested
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "browse") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        // quick swipe-left animation
        setSwipeClass("swipe-left");
        setTimeout(() => {
          setSwipeClass("");
          handlePass();
        }, 200);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleInterested();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewMode, currentIndex, filteredSublets.length, likedSublets]);

  // Touch handlers for simple swipe
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    setDragX(deltaX);
    dragXRef.current = deltaX;
  };

  const onTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 80;
    if (dragX < -threshold) {
      // Swipe left => pass
      setSwipeClass("swipe-left");
      setTimeout(() => {
        setSwipeClass("");
        setDragX(0);
        setIsDragging(false);
        handlePass();
      }, 200);
    } else if (dragX > threshold) {
      // Swipe right => interested
      setDragX(0);
      setIsDragging(false);
      // We keep the card to reveal email instead of animating off
      handleInterested();
    } else {
      // Reset
      setDragX(0);
      setIsDragging(false);
    }
    touchStartX.current = null;
  };

  // Desktop mouse drag handlers
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseStartX.current = e.clientX;
    setIsDragging(true);
    dragXRef.current = 0;

    const onMouseMoveWindow = (ev: MouseEvent) => {
      if (mouseStartX.current == null) return;
      const deltaX = ev.clientX - mouseStartX.current;
      setDragX(deltaX);
      dragXRef.current = deltaX;
    };

    const onMouseUpWindow = () => {
      const threshold = 80;
      const dx = dragXRef.current;
      if (dx < -threshold) {
        setSwipeClass("swipe-left");
        setTimeout(() => {
          setSwipeClass("");
          setDragX(0);
          setIsDragging(false);
          handlePass();
        }, 200);
      } else if (dx > threshold) {
        setDragX(0);
        setIsDragging(false);
        handleInterested();
      } else {
        setDragX(0);
        setIsDragging(false);
      }
      mouseStartX.current = null;
      window.removeEventListener("mousemove", onMouseMoveWindow);
      window.removeEventListener("mouseup", onMouseUpWindow);
    };

    window.addEventListener("mousemove", onMouseMoveWindow);
    window.addEventListener("mouseup", onMouseUpWindow);
  };

  // ----------------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------------

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="top-bar">
        <h1 className="app-title">🐺 HuskySublet</h1>
        <div className="view-toggle">
          <button
            className={viewMode === "browse" ? "active" : ""}
            onClick={() => setViewMode("browse")}
          >
            Browse
          </button>
          <button
            className={viewMode === "saved" ? "active" : ""}
            onClick={() => setViewMode("saved")}
          >
            Saved ({likedSublets.length})
          </button>
        </div>
      </header>

      <div className="main-content">
        {viewMode === "browse" ? (
          <>
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className="filters-sidebar">
              <h2>Filters</h2>

              {/* Price Filter */}
              <div className="filter-group">
                <label htmlFor="max-price">Max Price: ${maxPrice}</label>
                <input
                  id="max-price"
                  type="range"
                  min="500"
                  max="2000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    resetToStart();
                  }}
                />
              </div>

              {/* Neighborhood Filter */}
              <div className="filter-group">
                <label htmlFor="neighborhood">Neighborhood</label>
                <select
                  id="neighborhood"
                  value={selectedNeighborhood}
                  onChange={(e) => {
                    setSelectedNeighborhood(e.target.value);
                    resetToStart();
                  }}
                >
                  <option value="All">All</option>
                  <option value="U-District">U-District</option>
                  <option value="Capitol Hill">Capitol Hill</option>
                  <option value="Northgate">Northgate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Vibe Filter */}
              <div className="filter-group">
                <label>Vibes</label>
                <div className="vibe-checkboxes">
                  {allVibes.map((vibe) => (
                    <label key={vibe} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedVibes.includes(vibe)}
                        onChange={() => {
                          handleVibeToggle(vibe);
                          resetToStart();
                        }}
                      />
                      {vibe}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-summary">
                Showing {filteredSublets.length} sublet
                {filteredSublets.length !== 1 ? "s" : ""}
              </div>
            </aside>

            {/* MAIN CARD AREA */}
            <main className="card-area">
              {currentSublet ? (
                <div className="card-stack">
                  {filteredSublets[currentIndex + 1] && (
                    <div
                      className="profile-card behind"
                      aria-hidden
                      style={{
                        transform: `scale(${
                          0.98 + Math.min(Math.abs(dragX) / 600, 0.04)
                        }) translateY(8px) translateX(${-dragX * 0.04}px)`,
                        opacity: 0.7,
                      }}
                    >
                      <h2 className="card-title">
                        {filteredSublets[currentIndex + 1].title}
                      </h2>
                      <div className="card-info">
                        <div className="info-item">
                          <span className="info-label">Price:</span>
                          <span className="info-value">
                            ${filteredSublets[currentIndex + 1].price}/month
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`profile-card ${swipeClass} ${
                      isDragging ? "dragging" : ""
                    }`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onMouseDown={onMouseDown}
                    style={{
                      transform: isDragging
                        ? `translateX(${dragX}px) rotate(${dragX / 25}deg)`
                        : undefined,
                      transition: isDragging ? "none" : "transform 0.2s ease",
                    }}
                  >
                    <div
                      className={`swipe-badge pass ${
                        isDragging && dragX < -20 ? "show" : ""
                      }`}
                      style={{ opacity: Math.min(Math.abs(dragX) / 100, 1) }}
                    >
                      PASS
                    </div>
                    <div
                      className={`swipe-badge like ${
                        isDragging && dragX > 20 ? "show" : ""
                      }`}
                      style={{ opacity: Math.min(Math.abs(dragX) / 100, 1) }}
                    >
                      LIKE
                    </div>
                    {/* Title */}
                    <h2 className="card-title">{currentSublet.title}</h2>

                    {/* Price, Neighborhood, Dates */}
                    <div className="card-info">
                      <div className="info-item">
                        <span className="info-label">Price:</span>
                        <span className="info-value">
                          ${currentSublet.price}/month
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Location:</span>
                        <span className="info-value">
                          {currentSublet.neighborhood}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Dates:</span>
                        <span className="info-value">
                          {currentSublet.startDate} to {currentSublet.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Vibe Tags */}
                    <div className="vibe-tags">
                      {currentSublet.vibes.map((vibe) => (
                        <span key={vibe} className="vibe-badge">
                          {vibe}
                        </span>
                      ))}
                    </div>

                    {/* Prompt Question & Answer */}
                    <div className="prompt-section">
                      <div className="prompt-question">
                        {currentSublet.promptQuestion}
                      </div>
                      <div className="prompt-answer">
                        {currentSublet.promptAnswer}
                      </div>
                    </div>

                    {/* Email (only shown after "Interested" is clicked) */}
                    {showEmail && (
                      <div className="email-reveal">
                        ✉️ Contact: <strong>{currentSublet.email}</strong>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <button
                        className="circle-btn pass-btn"
                        onClick={handlePass}
                        aria-label="Pass"
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="circle-btn interested-btn"
                        onClick={handleInterested}
                        aria-label="Interested"
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M12 21s-6.5-4.35-9-8.1C1.2 10.2 2.1 7.5 4.5 6.3 6.4 5.3 8.7 6 10 7.6c1.3-1.6 3.6-2.3 5.5-1.3 2.4 1.2 3.3 3.9 1.5 6.6-2.5 3.75-9 8.1-9 8.1z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Card Counter */}
                    <div className="card-counter">
                      {currentIndex + 1} / {filteredSublets.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-more-message">
                  <h2>No more sublets match your filters! 🎉</h2>
                  <p>
                    Try adjusting your filters or check your saved listings.
                  </p>
                  <button onClick={resetToStart} className="reset-btn">
                    Start Over
                  </button>
                </div>
              )}
            </main>
          </>
        ) : (
          /* SAVED VIEW */
          <div className="saved-view">
            <h2>Your Saved Sublets</h2>
            {savedSubletsList.length === 0 ? (
              <p className="no-saved">
                You haven't saved any sublets yet. Start browsing!
              </p>
            ) : (
              <div className="saved-list">
                {savedSubletsList.map((sublet) => (
                  <div key={sublet.id} className="saved-card">
                    <div className="saved-header">
                      <h3>{sublet.title}</h3>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromSaved(sublet.id)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="saved-info">
                      <p>
                        <strong>Price:</strong> ${sublet.price}/month
                      </p>
                      <p>
                        <strong>Location:</strong> {sublet.neighborhood}
                      </p>
                      <p>
                        <strong>Dates:</strong> {sublet.startDate} to{" "}
                        {sublet.endDate}
                      </p>
                      <p>
                        <strong>Contact:</strong> {sublet.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
