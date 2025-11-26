# HuskySublet - Hinge-Style Dating App for Sublets

## 🎯 Complete Implementation

I've built a complete Hinge-style web app for UW students to browse sublets. The app is now running at **http://localhost:5173**

## ✨ Key Features Implemented

### 1. **Hinge-Style Card Interface**

- One sublet profile card at a time
- Clean, focused viewing experience
- Card counter shows progress (e.g., "3 / 8")

### 2. **Interactive Actions**

- **Pass Button (✕)**: Skip to next sublet
- **Interested Button (♥)**:
  - Saves sublet to your list
  - Reveals contact email with animation
  - Auto-advances to next card after 2 seconds

### 3. **Smart Filtering System**

- **Price Range Slider**: $500 - $2000 (adjustable in real-time)
- **Neighborhood Dropdown**: U-District, Capitol Hill, Northgate, Other
- **Vibe Tags**: Multi-select checkboxes for:
  - Quiet, Social, Clean, Pet-friendly
  - Modern, Bright, Study-friendly, etc.
- Filter summary shows count of matching sublets
- Filters reset view to first card

### 4. **Saved Listings View**

- Toggle between "Browse" and "Saved" modes
- Displays count in header (e.g., "Saved (3)")
- Shows all saved sublets in grid layout
- Remove button (✕) to unsave listings
- Full contact information visible for all saved items

### 5. **Professional UI/UX**

- **Husky Colors**: Purple (#4b2e83) and Gold (#b7a57a) throughout
- Gradient purple header
- Gold-tinted prompt sections
- Smooth animations and hover effects
- Responsive design for mobile/tablet/desktop

## 📊 Sample Data Included

8 realistic sublets with:

- Varied neighborhoods and prices
- Different vibe combinations
- Creative prompt Q&A (Hinge-style)
- UW email addresses
- Summer/fall date ranges

## 🏗️ Technical Implementation

### File Structure

```
src/
├── App.tsx          # Main component (486 lines)
│   ├── Data model & types
│   ├── Sample sublets array
│   ├── Filter logic with useMemo
│   ├── State management
│   ├── Event handlers
│   └── Render logic
├── App.css          # Complete styling (558 lines)
├── main.tsx         # React entry point
└── index.css        # Global styles
```

### State Management

```typescript
- maxPrice: number (slider value)
- selectedNeighborhood: string
- selectedVibes: string[] (multi-select)
- currentIndex: number (which card is shown)
- likedSublets: string[] (saved IDs)
- showEmail: boolean (reveal animation)
- viewMode: 'browse' | 'saved'
```

### Type Definitions

```typescript
interface Sublet {
  id: string;
  title: string;
  price: number;
  neighborhood: "U-District" | "Capitol Hill" | "Northgate" | "Other";
  startDate: string;
  endDate: string;
  vibes: string[];
  promptQuestion: string;
  promptAnswer: string;
  email: string;
}
```

## 🎨 Design Highlights

### Colors

- Primary: Husky Purple (#4b2e83)
- Accent: Husky Gold (#b7a57a)
- Backgrounds: Light purple (#e8e3f0), Gold tint (#f5f2ea)
- Success: Teal gradient for email reveal

### Components

- **Top Bar**: Purple gradient with view toggle buttons
- **Sidebar**: White card with sticky positioning
- **Profile Card**: Large centered card with shadow
- **Vibe Badges**: Purple gradient pills
- **Prompt Section**: Gold background for Q&A
- **Action Buttons**: Pass (outlined) vs Interested (filled purple)

### Responsive Breakpoints

- Desktop: Side-by-side layout (filters + card)
- Tablet (≤1024px): Stacked layout
- Mobile (≤768px): Full-width, vertical buttons

## 🚀 Usage Flow

1. User lands on browse view with first sublet card
2. Can adjust filters (price, location, vibes) - resets to first matching card
3. Reviews sublet details: title, price, dates, vibes, prompt
4. Clicks "Pass" → moves to next card
5. Clicks "Interested" → email appears with animation, card auto-advances
6. Can switch to "Saved" view to see all liked sublets
7. In saved view, can remove items or return to browsing
8. When all cards viewed, shows "No more sublets" message with reset option

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@vitejs/plugin-react": "^4.2.0",
  "typescript": "^5.3.0",
  "vite": "^5.0.0"
}
```

## ⚡ Performance Features

- `useMemo` for filtered sublets (only recomputes when filters change)
- Lazy state updates
- CSS transitions for smooth interactions
- No external libraries needed

## 🎓 Educational Value

This app demonstrates:

- TypeScript with React
- Hooks (useState, useMemo)
- Conditional rendering
- Event handling
- Array filtering/mapping
- CSS custom properties
- Responsive design
- Animation keyframes
- Component composition

Perfect for a portfolio piece or learning project!
