# Filtering and Sorting Utilities - Usage Examples

This document provides examples of how to use the filtering and sorting utilities in API routes.

## Basic Usage

### Restaurant Filtering

```typescript
import { db } from '@/lib/supabase/database';
import {
  parseRestaurantFilters,
  buildRestaurantQuery,
  sortByDistance,
} from '@/lib/utils/filtering';
import { calculateDistance, formatDistanceString } from '@/lib/utils/distance';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Parse filters from query parameters
  const filters = parseRestaurantFilters(searchParams);
  const sortBy = searchParams.get('sortBy') || 'name';
  
  // Build base query
  const baseQuery = db.from('restaurants').select('*', { count: 'exact' });
  
  // Apply filters and sorting
  const query = buildRestaurantQuery(baseQuery, filters, sortBy);
  
  // Execute query
  const { data: restaurants, error } = await query;
  
  // If sorting by distance, calculate distances and sort in-memory
  if (sortBy === 'distance') {
    const userLat = parseFloat(searchParams.get('latitude') || '0');
    const userLon = parseFloat(searchParams.get('longitude') || '0');
    
    const withDistance = restaurants.map(r => ({
      ...r,
      _distanceKm: calculateDistance(userLat, userLon, r.latitude, r.longitude),
      distance: formatDistanceString(
        calculateDistance(userLat, userLon, r.latitude, r.longitude)
      ),
    }));
    
    const sorted = sortByDistance(withDistance, 'asc');
    return NextResponse.json({ restaurants: sorted });
  }
  
  return NextResponse.json({ restaurants });
}
```

### Menu Item Filtering

```typescript
import { db } from '@/lib/supabase/database';
import {
  parseMenuItemFilters,
  buildMenuItemQuery,
} from '@/lib/utils/filtering';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get('restaurantId');
  
  // Parse filters
  const filters = parseMenuItemFilters(searchParams);
  filters.restaurantId = restaurantId;
  filters.status = 'active'; // Only show active items
  
  const sortBy = searchParams.get('sortBy');
  
  // Build and execute query
  const baseQuery = db.from('menu_items').select('*');
  const query = buildMenuItemQuery(baseQuery, filters, sortBy);
  
  const { data: items, error } = await query;
  
  return NextResponse.json({ items });
}
```

### Order Filtering

```typescript
import { db } from '@/lib/supabase/database';
import {
  parseOrderFilters,
  buildOrderQuery,
} from '@/lib/utils/filtering';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Parse filters
  const filters = parseOrderFilters(searchParams);
  const sortBy = searchParams.get('sortBy') || 'date';
  
  // Build and execute query
  const baseQuery = db.from('orders').select('*', { count: 'exact' });
  const query = buildOrderQuery(baseQuery, filters, sortBy);
  
  const { data: orders, error, count } = await query;
  
  return NextResponse.json({ orders, total: count });
}
```

## Advanced Usage

### Manual Filter Application

```typescript
import { db } from '@/lib/supabase/database';
import {
  applyRestaurantFilters,
  applySorting,
  RestaurantFilterOptions,
} from '@/lib/utils/filtering';

export async function GET(req: NextRequest) {
  // Define custom filters
  const filters: RestaurantFilterOptions = {
    city: 'Basel',
    status: 'active',
    minPrice: 20,
    maxPrice: 50,
  };
  
  // Build query step by step
  let query = db.from('restaurants').select('*');
  
  // Apply filters
  query = applyRestaurantFilters(query, filters);
  
  // Apply custom sorting
  query = applySorting(query, [
    { field: 'rating', order: 'desc' },
    { field: 'name', order: 'asc' },
  ]);
  
  const { data, error } = await query;
  
  return NextResponse.json({ restaurants: data });
}
```

### In-Memory Sorting and Filtering

```typescript
import { sortItems, filterItems } from '@/lib/utils/filtering';

// Sort items in memory
const sortedByPrice = sortItems(menuItems, 'price', 'asc');
const sortedByName = sortItems(restaurants, 'name', 'desc');

// Filter items in memory
const veganItems = filterItems(menuItems, item => 
  item.dietaryTags.includes('vegan')
);

const nearbyRestaurants = filterItems(restaurants, r => 
  r._distanceKm !== null && r._distanceKm < 10
);
```

### Custom Sort Options

```typescript
import {
  getRestaurantSortOptions,
  getMenuItemSortOptions,
  getOrderSortOptions,
} from '@/lib/utils/filtering';

// Get predefined sort options
const ratingSort = getRestaurantSortOptions('rating');
// Returns: { field: 'rating', order: 'desc' }

const priceSort = getMenuItemSortOptions('price');
// Returns: { field: 'price', order: 'asc' }

const dateSort = getOrderSortOptions('date');
// Returns: { field: 'created_at', order: 'desc' }

// Default sort options
const defaultRestaurantSort = getRestaurantSortOptions();
// Returns: { field: 'name', order: 'asc' }

const defaultMenuSort = getMenuItemSortOptions();
// Returns: [
//   { field: 'category', order: 'asc' },
//   { field: 'name', order: 'asc' }
// ]
```

## Query Parameter Examples

### Restaurant Queries

```
GET /api/restaurants?city=Basel&cuisineType=Ethiopian&sortBy=rating
GET /api/restaurants?region=Zürich&minPrice=20&maxPrice=50
GET /api/restaurants?search=african&sortBy=name
GET /api/restaurants?latitude=47.5596&longitude=7.5886&sortBy=distance
```

### Menu Item Queries

```
GET /api/restaurants/123/menu?category=meals&sortBy=price
GET /api/restaurants/123/menu?dietaryTag=vegan
GET /api/restaurants/123/menu?search=pizza&sortBy=name
```

### Order Queries

```
GET /api/orders?customerId=abc123&status=delivered&sortBy=date
GET /api/orders?startDate=2025-01-01&endDate=2025-01-31
GET /api/orders?region=Basel&status=new
GET /api/drivers/123/orders?status=in_transit&sortBy=date
```

## Filter Types

### RestaurantFilterOptions
- `city`: Filter by city name
- `region`: Filter by region
- `cuisineType`: Filter by cuisine type (matches array)
- `minPrice`: Minimum order amount
- `maxPrice`: Maximum order amount
- `search`: Full-text search on name and description
- `status`: Filter by status (pending, active, suspended)

### MenuItemFilterOptions
- `category`: Filter by category (meals, drinks, special_deals)
- `dietaryTag`: Filter by dietary tag (matches array)
- `search`: Full-text search on name and description
- `status`: Filter by status (active, inactive, out_of_stock)
- `restaurantId`: Filter by restaurant

### OrderFilterOptions
- `customerId`: Filter by customer
- `restaurantId`: Filter by restaurant
- `driverId`: Filter by driver
- `status`: Filter by order status
- `startDate`: Filter orders after this date
- `endDate`: Filter orders before this date
- `region`: Filter by delivery region
- `city`: Filter by delivery city

## Sort Options

### Restaurant Sorting
- `rating`: Sort by rating (descending)
- `name`: Sort by name (ascending)
- `price`: Sort by minimum order amount (ascending)
- `distance`: Sort by distance (requires coordinates, in-memory)

### Menu Item Sorting
- `price`: Sort by price (ascending)
- `name`: Sort by name (ascending)
- Default: Sort by category then name

### Order Sorting
- `date` or `created_at`: Sort by creation date (descending)
- `total` or `amount`: Sort by total amount (descending)
- `status`: Sort by status (ascending)
- Default: Sort by creation date (descending)
