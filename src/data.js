// Mock data for demo - seed with realistic sublet signals
export const mockSignals = [
  {
    id: 1,
    type: "offering",
    name: "Alex Chen",
    email: "alexc@uw.edu",
    neighborhood: "U-District",
    priceRange: "$800-$1000",
    quarter: "Spring",
    dates: "March 25 - June 10",
    roomType: "Private Room",
    notes: "Furnished room, 5 min walk to campus. Pet-friendly building.",
  },
  {
    id: 2,
    type: "looking",
    name: "Sarah Martinez",
    email: "sarahm@uw.edu",
    neighborhood: "Roosevelt",
    priceRange: "$600-$800",
    quarter: "Summer",
    dates: "June 15 - August 31",
    roomType: "Shared Room",
    notes: "Looking for a summer sublet, flexible on move-in date.",
  },
  {
    id: 3,
    type: "offering",
    name: "Mike Johnson",
    email: "mikej@uw.edu",
    neighborhood: "Capitol Hill",
    priceRange: "$1000-$1200",
    quarter: "Summer",
    dates: "June 20 - September 1",
    roomType: "Studio",
    notes: "Full studio apartment, utilities included. On bus line to UW.",
  },
  {
    id: 4,
    type: "looking",
    name: "Emily Wong",
    email: "emilyw@uw.edu",
    neighborhood: "U-District",
    priceRange: "$1000-$1200",
    quarter: "Fall",
    dates: "September 20 - December 15",
    roomType: "Private Room",
    notes: "Graduate student seeking quiet place, non-smoker.",
  },
  {
    id: 5,
    type: "offering",
    name: "David Kim",
    email: "davidk@uw.edu",
    neighborhood: "Fremont",
    priceRange: "$800-$1000",
    quarter: "Spring",
    dates: "March 15 - June 5",
    roomType: "Private Room",
    notes: "Room in 3BR house, parking available, near Light Rail.",
  },
];

// Constants for form dropdowns
export const NEIGHBORHOODS = [
  "U-District",
  "Capitol Hill",
  "Roosevelt",
  "Fremont",
  "Wallingford",
  "Ravenna",
  "Green Lake",
  "Other",
];

export const PRICE_RANGES = [
  "Under $600",
  "$600-$800",
  "$800-$1000",
  "$1000-$1200",
  "$1200+",
];

export const QUARTERS = ["Spring", "Summer", "Fall", "Winter"];

export const ROOM_TYPES = [
  "Private Room",
  "Shared Room",
  "Studio",
  "1 Bedroom",
  "Other",
];

export const SIGNAL_TYPES = [
  { value: "offering", label: "Offering Sublet" },
  { value: "looking", label: "Looking for Sublet" },
];
