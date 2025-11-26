# 🐺 HuskySublet

A Hinge-style web app for UW students to swipe through and save sublet listings.

## Features

- **Hinge-style card interface**: Swipe through one sublet at a time
- **Smart filters**: Price range, neighborhood, and vibe tags
- **Pass or Interested**: Simple actions to move through listings
- **Email reveal**: Contact info shown only when you're interested
- **Saved listings**: Keep track of sublets you like
- **No authentication needed**: All data lives in memory

## Tech Stack

- React 18 + TypeScript
- Vite (fast build tool)
- CSS with Husky colors (Purple & Gold)
- Functional components with hooks

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Opens at http://localhost:5173

## Build for Production

```bash
npm run build
npm run preview
```

## Data Model

Each sublet includes:
- Title, price, neighborhood
- Start/end dates
- Vibe tags (Quiet, Social, Pet-friendly, etc.)
- Prompt question & answer (Hinge-style)
- Contact email

## Usage

1. **Browse**: View sublets one at a time in card format
2. **Filter**: Use sidebar to filter by price, location, and vibes
3. **Pass**: Skip to next sublet
4. **Interested**: Save to your list and reveal contact email
5. **Saved**: View all your saved sublets with full contact info
