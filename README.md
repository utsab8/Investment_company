# InvestCorp - React Application

A modern React application for InvestCorp, a premium wealth management company. This application has been converted from HTML/CSS/JS to React with React Router for navigation.

## Features

- **React Router** for client-side routing
- **Responsive Design** with mobile navigation
- **Component-based Architecture** for maintainability
- **Modern React Hooks** (useState, useEffect) for state management
- **All Original Pages** converted to React components:
  - Home
  - About
  - Services
  - Process
  - Plans
  - Reports
  - Blog
  - FAQ
  - Contact

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Header.js      # Navigation header component
│   └── Footer.js      # Footer component
├── pages/
│   ├── Home.js        # Home page
│   ├── About.js       # About page
│   ├── Services.js     # Services page
│   ├── Process.js      # Process page
│   ├── Plans.js        # Plans page
│   ├── Reports.js      # Reports page
│   ├── Blog.js         # Blog page
│   ├── FAQ.js          # FAQ page
│   └── Contact.js      # Contact page
├── css/
│   ├── variables.css   # CSS variables
│   └── style.css       # Main stylesheet
├── App.js              # Main app component with routing
└── index.js            # Entry point

public/
└── index.html          # HTML template
```

## Key Changes from Original HTML

1. **Navigation**: Converted from anchor tags to React Router `Link` components
2. **JavaScript**: Converted vanilla JS to React hooks (useState, useEffect)
3. **Mobile Menu**: Implemented with React state management
4. **Forms**: Converted to controlled components with React state
5. **FAQ Accordion**: Implemented with React state for toggle functionality
6. **Event Handlers**: Converted inline event handlers to React event handlers

## Technologies Used

- React 18.2.0
- React Router DOM 6.20.0
- Font Awesome (via CDN)
- CSS Variables for theming

## Notes

- All original CSS styles have been preserved
- Font Awesome icons are loaded via CDN in `public/index.html`
- Images are loaded from Unsplash URLs (same as original)
- The application maintains the same visual design and functionality as the original HTML version






