# CategoryTabs Component

A React component for displaying horizontally scrollable category tabs in a Next.js e-commerce application, **fixed to the bottom of the screen**.

## Features

- ✅ **Fixed to bottom of screen** with sticky positioning
- ✅ Horizontally scrollable tabs with mobile responsiveness
- ✅ Active category state management using React useState
- ✅ Integration with existing `getProductsByCategory` function
- ✅ Product count badges for each category
- ✅ Disabled state for empty categories
- ✅ Tailwind CSS styling with smooth transitions
- ✅ TypeScript support with proper type definitions
- ✅ Reusable and modular design

## Usage

### Basic Usage

```tsx
import CategoryTabs from "./components/CategoryTabs";
import { getProductsByCategory, Database } from "./lib/products";

function MyComponent() {
  const [activeCategory, setActiveCategory] = useState<keyof Database>("pods");
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const products = getProductsByCategory(activeCategory);
    setCurrentProducts(products);
  }, [activeCategory]);

  const handleCategorySelect = (category: keyof Database) => {
    setActiveCategory(category);
  };

  return (
    <div className="pb-32">
      {" "}
      {/* Add bottom padding to prevent content overlap */}
      {/* Your content here */}
      <CategoryTabs
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
      />
    </div>
  );
}
```

### With Custom Styling

```tsx
<CategoryTabs
  onCategoryChange={handleCategoryChange}
  className="mb-6 border-b border-gray-200"
/>
```

## Props

| Prop               | Type                                 | Required | Description                                           |
| ------------------ | ------------------------------------ | -------- | ----------------------------------------------------- |
| `onCategorySelect` | `(category: keyof Database) => void` | No       | Callback function called when category is selected    |
| `activeCategory`   | `keyof Database`                     | No       | External active category state (for controlled usage) |
| `className`        | `string`                             | No       | Additional CSS classes for styling                    |

## Component Structure

The component automatically:

1. **Extracts categories** from the database structure using `Object.keys(database)`
2. **Manages active state** using React `useState`
3. **Calls `getProductsByCategory`** when a tab is clicked
4. **Handles empty categories** by disabling tabs with no products
5. **Provides responsive design** with horizontal scrolling on mobile
6. **Fixed positioning** at the bottom of the screen with proper z-index

## Important Notes

- **Bottom Padding Required**: Add `pb-32` (or equivalent bottom padding) to your main content container to prevent overlap with the fixed tab bar
- **Z-Index**: The component uses `z-50` to ensure it stays above other content
- **Mobile Optimized**: The horizontal scroll works perfectly on mobile devices

## Database Integration

The component works with the existing database structure:

```typescript
interface Database {
  cartriges: Product[];
  pods: Product[];
  chaser: Product[];
  octobar: Product[];
  fl: Product[];
}
```

## Styling

The component uses Tailwind CSS classes and includes:

- Responsive design with `overflow-x-auto`
- Smooth transitions with `transition-all duration-200`
- Active state styling with blue background
- Product count badges
- Gradient overlay for scroll indication

## Demo

Visit `/categories` to see a working demo of the component with product display.

## Requirements

- Next.js 13+ with App Router
- Tailwind CSS
- TypeScript
- Existing `getProductsByCategory` function from `lib/products.ts`
