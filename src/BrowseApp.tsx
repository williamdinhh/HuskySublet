import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { api, Listing } from "./utils/api";
import "./BrowseApp.css";

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
  images: string[];
}

// ============================================================================
// SAMPLE DATA - Hard-coded sublets for demo
// ============================================================================

// Generate placeholder image URLs (using Unsplash for property-like images)
const getPlaceholderImage = (seed: string) =>
  `https://source.unsplash.com/600x400/?apartment,room&sig=${seed}`;

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
    images: [
      getPlaceholderImage("1"),
      getPlaceholderImage("1a"),
      getPlaceholderImage("1b"),
    ],
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
    images: [getPlaceholderImage("2"), getPlaceholderImage("2a")],
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
    images: [
      getPlaceholderImage("3"),
      getPlaceholderImage("3a"),
      getPlaceholderImage("3b"),
      getPlaceholderImage("3c"),
    ],
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
    images: [getPlaceholderImage("4"), getPlaceholderImage("4a")],
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
    images: [
      getPlaceholderImage("5"),
      getPlaceholderImage("5a"),
      getPlaceholderImage("5b"),
      getPlaceholderImage("5c"),
      getPlaceholderImage("5d"),
    ],
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
    images: [
      getPlaceholderImage("6"),
      getPlaceholderImage("6a"),
      getPlaceholderImage("6b"),
    ],
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
    images: [getPlaceholderImage("7"), getPlaceholderImage("7a")],
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
    images: [
      getPlaceholderImage("8"),
      getPlaceholderImage("8a"),
      getPlaceholderImage("8b"),
      getPlaceholderImage("8c"),
    ],
  },
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function BrowseApp() {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------

  // Filter states
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<string>("All");
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Listings from API
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Current card index
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Liked sublets (stores IDs)
  const [likedSublets, setLikedSublets] = useState<string[]>([]);

  // Show email on current card after clicking "Interested"
  const [showEmail, setShowEmail] = useState<boolean>(false);

  // Browse type: 'sellers' or 'buyers'
  const [browseType, setBrowseType] = useState<"sellers" | "buyers">("sellers");

  // Filter drawer state
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Current image index for image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Simple swipe/drag state
  const [dragX, setDragX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [swipeClass, setSwipeClass] = useState<
    "" | "swipe-left" | "swipe-right"
  >("");
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const dragXRef = useRef<number>(0);

  // Image swipe state
  const [imageDragX, setImageDragX] = useState<number>(0);
  const [isImageDragging, setIsImageDragging] = useState<boolean>(false);
  const imageTouchStartX = useRef<number | null>(null);

  // Load listings from API
  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const response = await api.getListings(browseType);
        setListings(response.listings);
      } catch (err: any) {
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname === '/') {
      loadListings();
    }
  }, [browseType, location.pathname]);

  // ----------------------------------------------------------------------------
  // FILTERED SUBLETS - Compute based on filters
  // ----------------------------------------------------------------------------

  const filteredSublets = useMemo(() => {
    return listings.filter((sublet) => {
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
      if (selectedVibes.length > 0 && sublet.vibes) {
        const hasMatchingVibe = selectedVibes.some((vibe) =>
          sublet.vibes.includes(vibe)
        );
        if (!hasMatchingVibe) return false;
      }

      return true;
    });
  }, [listings, maxPrice, selectedNeighborhood, selectedVibes]);

  // Current sublet being displayed
  const currentSublet = filteredSublets[currentIndex];

  // ----------------------------------------------------------------------------
  // VIBE OPTIONS - Extract all unique vibes from sample data
  // ----------------------------------------------------------------------------

  const allVibes = useMemo(() => {
    const vibeSet = new Set<string>();
    listings.forEach((sublet) => {
      if (sublet.vibes) {
        sublet.vibes.forEach((vibe) => vibeSet.add(vibe));
      }
    });
    return Array.from(vibeSet).sort();
  }, [listings]);

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

  const handleInterested = async () => {
    if (currentSublet) {
      try {
        // Like the listing via API
        const result = await api.likeListing(currentSublet._id);
        
        // Add to liked list
        if (!likedSublets.includes(currentSublet._id)) {
          setLikedSublets([...likedSublets, currentSublet._id]);
        }

        // Show match notification if matched
        if (result.matched) {
          alert(`🎉 It's a match! You can now chat with ${(currentSublet.ownerId as any)?.name || 'them'}.`);
          // Could navigate to matches page here
        }

        // Show email
        const ownerEmail = typeof currentSublet.ownerId === 'object' 
          ? currentSublet.ownerId.email 
          : 'N/A';
        setShowEmail(true);

        // Auto-advance after a moment
        setTimeout(() => {
          setShowEmail(false);
          if (currentIndex < filteredSublets.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            setCurrentIndex(filteredSublets.length);
          }
        }, 3000);
      } catch (err: any) {
        alert(err.message || "Failed to like listing");
      }
    }
  };

  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };



  // Reset to first card when filters change
  const resetToStart = () => {
    setCurrentIndex(0);
    setShowEmail(false);
    setDragX(0);
    setIsDragging(false);
    setSwipeClass("");
    setCurrentImageIndex(0);
  };

  // Reset image index when card changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentIndex]);

  // Keyboard shortcuts: Left = Pass, Right = Interested, Left/Right arrows for image navigation when holding Shift
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (location.pathname !== "/" || !currentSublet) return;

      // Image navigation with Shift + Arrow keys
      if (
        e.shiftKey &&
        currentSublet.images &&
        currentSublet.images.length > 1
      ) {
        if (e.key === "ArrowLeft" && currentImageIndex > 0) {
          e.preventDefault();
          setCurrentImageIndex(currentImageIndex - 1);
          return;
        } else if (
          e.key === "ArrowRight" &&
          currentImageIndex < currentSublet.images.length - 1
        ) {
          e.preventDefault();
          setCurrentImageIndex(currentImageIndex + 1);
          return;
        }
      }

      // Card navigation (only if not navigating images)
      if (!e.shiftKey) {
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
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    location.pathname,
    currentIndex,
    filteredSublets.length,
    likedSublets,
    currentSublet,
    currentImageIndex,
  ]);

  // Touch handlers for card swipe (excluding image area)
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Don't start card swipe if touching image area
    const target = e.target as HTMLElement;
    if (target.closest(".card-image-container")) return;

    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null || isImageDragging) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    setDragX(deltaX);
    dragXRef.current = deltaX;
  };

  const onTouchEnd = () => {
    if (!isDragging || isImageDragging) return;
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

  // Image swipe handlers
  const onImageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (
      !currentSublet ||
      !currentSublet.images ||
      currentSublet.images.length <= 1
    )
      return;
    imageTouchStartX.current = e.touches[0].clientX;
    setIsImageDragging(true);
  };

  const onImageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (imageTouchStartX.current == null || !isImageDragging) return;
    const deltaX = e.touches[0].clientX - imageTouchStartX.current;
    setImageDragX(deltaX);
  };

  const onImageTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (
      !isImageDragging ||
      !currentSublet ||
      !currentSublet.images ||
      currentSublet.images.length <= 1
    ) {
      setIsImageDragging(false);
      setImageDragX(0);
      imageTouchStartX.current = null;
      return;
    }

    const threshold = 50;
    if (
      imageDragX < -threshold &&
      currentImageIndex < currentSublet.images.length - 1
    ) {
      // Swipe left => next image
      setCurrentImageIndex(currentImageIndex + 1);
    } else if (imageDragX > threshold && currentImageIndex > 0) {
      // Swipe right => previous image
      setCurrentImageIndex(currentImageIndex - 1);
    }

    setImageDragX(0);
    setIsImageDragging(false);
    imageTouchStartX.current = null;
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

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Only show browse content on home page
  if (location.pathname !== '/') {
    return null; // Let router handle other pages
  }

  return (
    <div className="app">
      {/* TOP BAR */}
      <header className="top-bar">
        <h1 className="app-title">HuskySublet</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={logout}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* BOTTOM NAVIGATION */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.75rem 0',
        zIndex: 1000,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Home</span>
        </button>
        <button
          onClick={() => navigate('/chat')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/chat' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Chat</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: location.pathname === '/profile' ? '#007AFF' : '#666',
            padding: '0.5rem 1rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span style={{ fontSize: '0.75rem' }}>Profile</span>
        </button>
      </nav>

      {/* FILTERS DRAWER */}
      <div
        className={`filters-drawer-overlay ${filtersOpen ? "show" : ""}`}
        onClick={() => setFiltersOpen(false)}
      />
      <aside className={`filters-drawer ${filtersOpen ? "open" : ""}`}>
        <div className="filters-drawer-header">
          <h2>Filters</h2>
          <button
            className="close-filters"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

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

      <div className="main-content" style={{ paddingBottom: '80px' }}>
        <>
          {/* SELLER/BUYER TAB */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0 1rem',
            background: '#f5f5f7',
            borderRadius: '12px',
            padding: '0.5rem',
            maxWidth: '400px',
            margin: '0 auto 1.5rem',
          }}>
            <button
              onClick={() => {
                setBrowseType('sellers');
                resetToStart();
              }}
              style={{
                flex: 1,
                padding: '0.875rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: browseType === 'sellers' ? '#007AFF' : 'transparent',
                color: browseType === 'sellers' ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: browseType === 'sellers' ? '600' : '500',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                boxShadow: browseType === 'sellers' ? '0 2px 8px rgba(0,122,255,0.3)' : 'none',
              }}
            >
              Browse Sellers
            </button>
            <button
              onClick={() => {
                setBrowseType('buyers');
                resetToStart();
              }}
              style={{
                flex: 1,
                padding: '0.875rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: browseType === 'buyers' ? '#007AFF' : 'transparent',
                color: browseType === 'buyers' ? 'white' : '#666',
                cursor: 'pointer',
                fontWeight: browseType === 'buyers' ? '600' : '500',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                boxShadow: browseType === 'buyers' ? '0 2px 8px rgba(0,122,255,0.3)' : 'none',
              }}
            >
              Browse Buyers
            </button>
          </div>

          {/* FILTER BUTTON */}
          <button
            className="filter-button"
            onClick={() => setFiltersOpen(true)}
            aria-label="Open filters"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </button>

            {/* MAIN CARD AREA */}
            <main className="card-area">
              {loading ? (
                <div className="no-more-message">
                  <h2>Loading listings...</h2>
                </div>
              ) : error ? (
                <div className="no-more-message">
                  <h2>Error</h2>
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()} className="reset-btn">
                    Retry
                  </button>
                </div>
              ) : currentSublet ? (
                <div className="card-stack">
                  {/* Behind card preview */}
                  {filteredSublets[currentIndex + 1] && (
                    <div
                      className="profile-card behind"
                      aria-hidden
                      style={{
                        transform: `scale(${
                          0.96 + Math.min(Math.abs(dragX) / 600, 0.03)
                        }) translateY(8px) translateX(${-dragX * 0.04}px)`,
                        opacity: 0.6,
                      }}
                    >
                      <div className="card-image-container">
                        {filteredSublets[currentIndex + 1].images &&
                        filteredSublets[currentIndex + 1].images.length > 0 ? (
                          <img
                            src={filteredSublets[currentIndex + 1].images[0]}
                            alt={filteredSublets[currentIndex + 1].title}
                            className="card-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="image-placeholder">🏠</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Main card */}
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
                      transition: isDragging
                        ? "none"
                        : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {/* Swipe badges */}
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

                    {/* Card counter */}
                    {filteredSublets.length > 0 && (
                      <div className="card-counter">
                        {currentIndex + 1} / {filteredSublets.length}
                      </div>
                    )}

                    {/* Image Gallery */}
                    <div
                      className="card-image-container"
                      onTouchStart={onImageTouchStart}
                      onTouchMove={onImageTouchMove}
                      onTouchEnd={onImageTouchEnd}
                      style={{
                        transform: isImageDragging
                          ? `translateX(${imageDragX}px)`
                          : undefined,
                        transition: isImageDragging
                          ? "none"
                          : "transform 0.3s ease",
                      }}
                    >
                      {currentSublet.images && currentSublet.images.length > 0 ? (
                        <>
                          <img
                            src={
                              currentSublet.images[currentImageIndex] ||
                              currentSublet.images[0]
                            }
                            alt={currentSublet.title}
                            className="card-image"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = "none";
                              if (!img.nextElementSibling) {
                                const placeholder =
                                  document.createElement("div");
                                placeholder.className = "image-placeholder";
                                placeholder.textContent = "🏠";
                                img.parentElement?.appendChild(placeholder);
                              }
                            }}
                          />
                          {currentSublet.images.length > 1 && (
                            <div className="image-counter">
                              {currentImageIndex + 1} /{" "}
                              {currentSublet.images.length}
                            </div>
                          )}
                          {/* Image navigation dots */}
                          {currentSublet.images.length > 1 && (
                            <div
                              style={{
                                position: "absolute",
                                bottom: "12px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                display: "flex",
                                gap: "6px",
                                zIndex: 2,
                              }}
                            >
                              {currentSublet.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(idx);
                                  }}
                                  style={{
                                    width:
                                      idx === currentImageIndex
                                        ? "24px"
                                        : "8px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    border: "none",
                                    background:
                                      idx === currentImageIndex
                                        ? "white"
                                        : "rgba(255, 255, 255, 0.5)",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    padding: 0,
                                  }}
                                  aria-label={`Go to image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="image-placeholder">🏠</div>
                      )}
                    </div>

                    {/* Scrollable card content */}
                    <div className="card-content">
                      {/* Header */}
                      <div className="card-header">
                        <h2 className="card-title">{currentSublet.title}</h2>
                        <div className="card-price">
                          ${currentSublet.price}/month
                        </div>
                      </div>

                      {/* Info rows */}
                      <div className="card-info">
                        <div className="info-row">
                          <span className="info-label">Location</span>
                          <span className="info-value">
                            {currentSublet.neighborhood}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Available</span>
                          <span className="info-value">
                            {formatDate(currentSublet.startDate)} -{" "}
                            {formatDate(currentSublet.endDate)}
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

                      {/* Prompt Section */}
                      <div className="prompt-section">
                        <div className="prompt-question">
                          {currentSublet.promptQuestion}
                        </div>
                        <div className="prompt-answer">
                          {currentSublet.promptAnswer}
                        </div>
                      </div>

                    {/* Email reveal */}
                    {showEmail && (
                      <div className="email-reveal">
                        ✉️ Contact: <strong>
                          {typeof currentSublet.ownerId === 'object' 
                            ? currentSublet.ownerId.email 
                            : 'N/A'}
                        </strong>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-more-message">
                  <h2>No more sublets match your filters!</h2>
                  <p>
                    Try adjusting your filters or check your saved listings.
                  </p>
                  <button onClick={resetToStart} className="reset-btn">
                    Start Over
                  </button>
                </div>
              )}
            </main>

          {/* BOTTOM ACTION BAR */}
          {currentSublet && (
            <div className="bottom-action-bar">
              <button
                className="action-button pass-button"
                onClick={handlePass}
                aria-label="Pass"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                className="action-button like-button"
                onClick={handleInterested}
                aria-label="Interested"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                >
                  <path d="M12 21s-8-4.5-8-11.8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 8 3.2C20 16.5 12 21 12 21z"></path>
                </svg>
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

