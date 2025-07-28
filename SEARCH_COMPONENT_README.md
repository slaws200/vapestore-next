# SearchInput Component

A comprehensive, full-text search component for product names with fuzzy matching, real-time search, and keyboard navigation.

## Features

- 🔍 **Real-time Search**: Results update as you type with 300ms debouncing
- 🎯 **Fuzzy Matching**: Find products even with typos or partial matches
- ⌨️ **Keyboard Navigation**: Use arrow keys, Enter, and Escape for navigation
- 📱 **Mobile Friendly**: Responsive design that works on all devices
- 🎨 **Customizable**: Configurable placeholder text and styling
- ⚡ **Performance Optimized**: Debounced search and limited results (max 10)
- 🎯 **Search Highlighting**: Matched terms are highlighted in results
- 🚫 **Click Outside**: Closes dropdown when clicking outside

## Installation

The component is already included in your project at `src/app/components/SearchInput.tsx`.

## Basic Usage

```tsx
import SearchInput from "./components/SearchInput";

function MyComponent() {
  const handleSearch = (results) => {
    console.log("Search results:", results);
  };

  return (
    <SearchInput onSearch={handleSearch} placeholder="Search products..." />
  );
}
```

## Props

| Prop          | Type                           | Default                | Description                                         |
| ------------- | ------------------------------ | ---------------------- | --------------------------------------------------- |
| `onSearch`    | `(results: Product[]) => void` | `undefined`            | Callback function called when search results change |
| `placeholder` | `string`                       | `"Search products..."` | Placeholder text for the input field                |
| `className`   | `string`                       | `""`                   | Additional CSS classes for styling                  |

## Advanced Usage

### With Custom Styling

```tsx
<SearchInput
  onSearch={handleSearch}
  placeholder="Find your favorite products..."
  className="max-w-lg mx-auto"
/>
```

### Handling Search Results

```tsx
import { useState } from "react";
import SearchInput from "./components/SearchInput";
import { Product } from "./types/product";

function ProductSearch() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
    // You can also trigger other actions here
    // e.g., update URL, show loading states, etc.
  };

  return (
    <div>
      <SearchInput onSearch={handleSearch} />

      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3>Found {searchResults.length} products:</h3>
          {searchResults.map((product) => (
            <div key={product.id}>
              {product.name} - ₽{product.price}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Search Algorithm

The component uses a sophisticated search algorithm that includes:

1. **Exact Matching**: Direct substring matches get highest priority
2. **Fuzzy Matching**: Characters can appear in order with gaps
3. **Case Insensitive**: Search is not case-sensitive
4. **Relevance Sorting**: Exact matches appear before fuzzy matches
5. **Alphabetical Sorting**: Within each relevance group, results are sorted alphabetically

### Example Search Behavior

- Searching for "blue" will find:
  - "Blueberry" (exact match)
  - "Blue Razz" (exact match)
  - "Strawberry Blue" (exact match)
- Searching for "blu" will find:
  - "Blueberry" (fuzzy match)
  - "Blue Razz" (fuzzy match)

## Keyboard Navigation

- **Arrow Down**: Navigate to next result
- **Arrow Up**: Navigate to previous result
- **Enter**: Select highlighted result (navigates to product page)
- **Escape**: Close search dropdown and clear focus

## Styling

The component uses Tailwind CSS classes and can be customized by:

1. **Adding custom classes** via the `className` prop
2. **Modifying the component's internal styles** in the source file
3. **Using CSS custom properties** for theme customization

### Default Styling

- Input field with rounded corners and focus ring
- Search icon on the left
- Clear button on the right (when text is present)
- Dropdown with shadow and border
- Hover effects on result items
- Loading spinner during search

## Performance Considerations

- **Debouncing**: 300ms delay prevents excessive API calls
- **Result Limiting**: Maximum 10 results displayed
- **Lazy Loading**: Images use lazy loading
- **Memoization**: Search function is memoized with useCallback
- **Event Cleanup**: Proper cleanup of event listeners and timeouts

## Browser Compatibility

- Modern browsers with ES6+ support
- React 18+ compatible
- Next.js 13+ App Router compatible
- TypeScript support included

## Troubleshooting

### Common Issues

1. **Search not working**: Ensure `getAllProducts()` function is properly imported and working
2. **No results showing**: Check that products have `available: true` property
3. **Styling issues**: Verify Tailwind CSS is properly configured
4. **TypeScript errors**: Ensure all types are properly imported

### Debug Mode

To debug search functionality, you can add console logs:

```tsx
const handleSearch = (results: Product[]) => {
  console.log("Search query:", query);
  console.log("Search results:", results);
  setSearchResults(results);
};
```

## Examples

See `src/app/components/SearchDemo.tsx` for a complete example implementation that demonstrates all features of the search component.

## Contributing

When modifying the search component:

1. Maintain the existing API for backward compatibility
2. Add new features as optional props
3. Update this documentation
4. Test with various product names and edge cases
5. Ensure mobile responsiveness is maintained
