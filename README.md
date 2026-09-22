# Car Buying & Selling Website

This is a React TypeScript application for a car buying and selling platform. The application is intentionally built with various complex bugs and issues that are difficult for AI models to fix.

## Features

- **Main Navigation**: Complex navbar with memory leaks, state issues, and accessibility problems
- **Category Grid**: CSS Grid/Flexbox conflicts, overlapping elements, and mobile layout bugs
- **Car Filters**: State management bugs, expensive computations, and UI responsiveness issues
- **Color Theme**: Direct DOM manipulation, race conditions, and theme synchronization bugs
- **Content Section**: Complex reducer logic, context issues, and selection state bugs

## Intentional Bugs

This application contains intentionally implemented bugs including:

### 1. CSS Layout Issues
- Flexbox and Grid conflicts
- Z-index stacking problems
- Mobile responsiveness failures
- Print style sheet conflicts
- Dark mode contrast issues

### 2. React State Management Bugs
- Memory leaks from uncleaned intervals
- Race conditions in useEffect hooks
- Expensive computations in useMemo
- Incorrect dependency arrays
- State mutation bugs

### 3. Accessibility Problems
- Missing ARIA labels and attributes
- Keyboard navigation traps
- Color contrast violations
- Missing focus indicators
- Screen reader compatibility issues

### 4. Performance Issues
- Expensive animations causing jank
- Forced reflows and repaints
- Unnecessary re-renders
- Large bundle sizes from unused code

### 5. TypeScript Anti-patterns
- `any` type overuse
- Missing type safety
- Complex union types without guards
- Incorrect hook dependencies

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── MainNavigation.tsx     # Complex navbar with state bugs
│   ├── CategoryGrid.tsx       # CSS Grid layout conflicts
│   ├── CarFilters.tsx         # Filter state management bugs
│   ├── ColorTheme.tsx         # Theme synchronization issues
│   └── ContentSection.tsx     # Complex reducer and context bugs
├── App.tsx                    # Main app with intentional bugs
├── App.css                    # Complex CSS with conflicts
└── index.tsx                  # Entry point
```

## Testing AI Model Fixes

This project is designed to test AI models' ability to fix complex frontend bugs. The bugs are intentionally subtle and interconnected, making them challenging to fix without understanding the full context.

### Common Failure Points for AI Models:

1. **CSS Conflicts**: AI models often apply superficial fixes that break other parts of the layout
2. **State Race Conditions**: Models struggle with timing issues and dependency management
3. **Accessibility**: AI frequently misses nuanced accessibility requirements
4. **Performance**: Models tend to optimize locally but miss systemic performance issues
5. **Type Safety**: AI often introduces type errors while trying to fix other issues

## Note to Developers

This codebase contains intentionally bad practices. Do not use this as a reference for production code. The purpose is to create a challenging test bed for AI-assisted debugging and refactoring.

## License

MIT