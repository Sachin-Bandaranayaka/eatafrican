/**
 * Filtering and Sorting Utilities
 * Generic utilities for database queries with filtering and sorting
 */

// Type for Supabase query builder (simplified to avoid complex generics)
type QueryBuilder = any;

/**
 * Filter options for restaurants
 */
export interface RestaurantFilterOptions {
  city?: string;
  region?: string;
  cuisineType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
}

/**
 * Filter options for menu items
 */
export interface MenuItemFilterOptions {
  category?: 'meals' | 'drinks' | 'special_deals';
  dietaryTag?: string;
  search?: string;
  status?: string;
  restaurantId?: string;
}

/**
 * Filter options for orders
 */
export interface OrderFilterOptions {
  customerId?: string;
  restaurantId?: string;
  driverId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  region?: string;
  city?: string;
}

/**
 * Sort options
 */
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: string;
  order?: SortOrder;
}

/**
 * Apply restaurant filters to a Supabase query
 */
export function applyRestaurantFilters(
  query: QueryBuilder,
  filters: RestaurantFilterOptions
): QueryBuilder {
  let filteredQuery = query;

  if (filters.city) {
    filteredQuery = filteredQuery.eq('city', filters.city);
  }

  if (filters.region) {
    filteredQuery = filteredQuery.eq('region', filters.region);
  }

  if (filters.cuisineType) {
    filteredQuery = filteredQuery.contains('cuisine_types', [filters.cuisineType]);
  }

  if (filters.minPrice !== undefined) {
    filteredQuery = filteredQuery.gte('min_order_amount', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    filteredQuery = filteredQuery.lte('min_order_amount', filters.maxPrice);
  }

  if (filters.status) {
    filteredQuery = filteredQuery.eq('status', filters.status);
  }

  if (filters.search) {
    // Full-text search on name and description
    filteredQuery = filteredQuery.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  return filteredQuery;
}

/**
 * Apply menu item filters to a Supabase query
 */
export function applyMenuItemFilters(
  query: QueryBuilder,
  filters: MenuItemFilterOptions
): QueryBuilder {
  let filteredQuery = query;

  if (filters.restaurantId) {
    filteredQuery = filteredQuery.eq('restaurant_id', filters.restaurantId);
  }

  if (filters.category) {
    filteredQuery = filteredQuery.eq('category', filters.category);
  }

  if (filters.dietaryTag) {
    filteredQuery = filteredQuery.contains('dietary_tags', [filters.dietaryTag]);
  }

  if (filters.status) {
    filteredQuery = filteredQuery.eq('status', filters.status);
  }

  if (filters.search) {
    // Full-text search on name and description
    filteredQuery = filteredQuery.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  return filteredQuery;
}

/**
 * Apply order filters to a Supabase query
 */
export function applyOrderFilters(
  query: QueryBuilder,
  filters: OrderFilterOptions
): QueryBuilder {
  let filteredQuery = query;

  if (filters.customerId) {
    filteredQuery = filteredQuery.eq('customer_id', filters.customerId);
  }

  if (filters.restaurantId) {
    filteredQuery = filteredQuery.eq('restaurant_id', filters.restaurantId);
  }

  if (filters.driverId) {
    filteredQuery = filteredQuery.eq('driver_id', filters.driverId);
  }

  if (filters.status) {
    filteredQuery = filteredQuery.eq('status', filters.status);
  }

  if (filters.region) {
    filteredQuery = filteredQuery.eq('delivery_city', filters.region);
  }

  if (filters.city) {
    filteredQuery = filteredQuery.eq('delivery_city', filters.city);
  }

  if (filters.startDate) {
    filteredQuery = filteredQuery.gte('created_at', filters.startDate);
  }

  if (filters.endDate) {
    filteredQuery = filteredQuery.lte('created_at', filters.endDate);
  }

  return filteredQuery;
}

/**
 * Apply sorting to a Supabase query
 */
export function applySorting(
  query: QueryBuilder,
  sortOptions: SortOptions | SortOptions[]
): QueryBuilder {
  let sortedQuery = query;

  const sorts = Array.isArray(sortOptions) ? sortOptions : [sortOptions];

  sorts.forEach((sort) => {
    const ascending = sort.order === 'asc' || sort.order === undefined;
    sortedQuery = sortedQuery.order(sort.field, { ascending });
  });

  return sortedQuery;
}

/**
 * Get restaurant sort options based on sort type
 */
export function getRestaurantSortOptions(
  sortBy?: string
): SortOptions | SortOptions[] | null {
  switch (sortBy) {
    case 'rating':
      return { field: 'rating', order: 'desc' };
    case 'name':
      return { field: 'name', order: 'asc' };
    case 'price':
      return { field: 'min_order_amount', order: 'asc' };
    case 'distance':
      // Distance sorting is handled in-memory after fetching
      return null;
    default:
      return { field: 'name', order: 'asc' };
  }
}

/**
 * Get menu item sort options based on sort type
 */
export function getMenuItemSortOptions(
  sortBy?: string
): SortOptions | SortOptions[] {
  switch (sortBy) {
    case 'price':
      return { field: 'price', order: 'asc' };
    case 'name':
      return { field: 'name', order: 'asc' };
    default:
      // Default: sort by category then name
      return [
        { field: 'category', order: 'asc' },
        { field: 'name', order: 'asc' },
      ];
  }
}

/**
 * Get order sort options based on sort type
 */
export function getOrderSortOptions(sortBy?: string): SortOptions {
  switch (sortBy) {
    case 'date':
    case 'created_at':
      return { field: 'created_at', order: 'desc' };
    case 'total':
    case 'amount':
      return { field: 'total_amount', order: 'desc' };
    case 'status':
      return { field: 'status', order: 'asc' };
    default:
      return { field: 'created_at', order: 'desc' };
  }
}

/**
 * Sort array of items by distance (in-memory sorting)
 */
export function sortByDistance<T extends { _distanceKm?: number | null }>(
  items: T[],
  order: SortOrder = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    // Handle null distances (put them at the end)
    if (a._distanceKm === null || a._distanceKm === undefined) return 1;
    if (b._distanceKm === null || b._distanceKm === undefined) return -1;

    const diff = a._distanceKm - b._distanceKm;
    return order === 'asc' ? diff : -diff;
  });
}

/**
 * Generic in-memory sorting function
 */
export function sortItems<T>(
  items: T[],
  field: keyof T,
  order: SortOrder = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    // Handle null/undefined values
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    // Compare values
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter array of items by a predicate function
 */
export function filterItems<T>(
  items: T[],
  predicate: (item: T) => boolean
): T[] {
  return items.filter(predicate);
}

/**
 * Parse and validate filter parameters from URL search params
 */
export function parseRestaurantFilters(
  searchParams: URLSearchParams
): RestaurantFilterOptions {
  const filters: RestaurantFilterOptions = {};

  const city = searchParams.get('city');
  if (city) filters.city = city;

  const region = searchParams.get('region');
  if (region) filters.region = region;

  const cuisineType = searchParams.get('cuisineType');
  if (cuisineType) filters.cuisineType = cuisineType;

  const minPrice = searchParams.get('minPrice');
  if (minPrice) filters.minPrice = parseFloat(minPrice);

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

  const search = searchParams.get('search');
  if (search) filters.search = search;

  const status = searchParams.get('status');
  if (status) filters.status = status;

  return filters;
}

/**
 * Parse and validate menu item filter parameters from URL search params
 */
export function parseMenuItemFilters(
  searchParams: URLSearchParams
): MenuItemFilterOptions {
  const filters: MenuItemFilterOptions = {};

  const category = searchParams.get('category');
  if (category && ['meals', 'drinks', 'special_deals'].includes(category)) {
    filters.category = category as 'meals' | 'drinks' | 'special_deals';
  }

  const dietaryTag = searchParams.get('dietaryTag');
  if (dietaryTag) filters.dietaryTag = dietaryTag;

  const search = searchParams.get('search');
  if (search) filters.search = search;

  const status = searchParams.get('status');
  if (status) filters.status = status;

  return filters;
}

/**
 * Parse and validate order filter parameters from URL search params
 */
export function parseOrderFilters(
  searchParams: URLSearchParams
): OrderFilterOptions {
  const filters: OrderFilterOptions = {};

  const customerId = searchParams.get('customerId');
  if (customerId) filters.customerId = customerId;

  const restaurantId = searchParams.get('restaurantId');
  if (restaurantId) filters.restaurantId = restaurantId;

  const driverId = searchParams.get('driverId');
  if (driverId) filters.driverId = driverId;

  const status = searchParams.get('status');
  if (status) filters.status = status;

  const startDate = searchParams.get('startDate');
  if (startDate) filters.startDate = startDate;

  const endDate = searchParams.get('endDate');
  if (endDate) filters.endDate = endDate;

  const region = searchParams.get('region');
  if (region) filters.region = region;

  const city = searchParams.get('city');
  if (city) filters.city = city;

  return filters;
}

/**
 * Build a complete query with filters and sorting
 */
export function buildRestaurantQuery(
  baseQuery: QueryBuilder,
  filters: RestaurantFilterOptions,
  sortBy?: string
): QueryBuilder {
  // Apply filters
  let query = applyRestaurantFilters(baseQuery, filters);

  // Apply sorting (if not distance-based)
  const sortOptions = getRestaurantSortOptions(sortBy);
  if (sortOptions) {
    query = applySorting(query, sortOptions);
  }

  return query;
}

/**
 * Build a complete query with filters and sorting for menu items
 */
export function buildMenuItemQuery(
  baseQuery: QueryBuilder,
  filters: MenuItemFilterOptions,
  sortBy?: string
): QueryBuilder {
  // Apply filters
  let query = applyMenuItemFilters(baseQuery, filters);

  // Apply sorting
  const sortOptions = getMenuItemSortOptions(sortBy);
  query = applySorting(query, sortOptions);

  return query;
}

/**
 * Build a complete query with filters and sorting for orders
 */
export function buildOrderQuery(
  baseQuery: QueryBuilder,
  filters: OrderFilterOptions,
  sortBy?: string
): QueryBuilder {
  // Apply filters
  let query = applyOrderFilters(baseQuery, filters);

  // Apply sorting
  const sortOptions = getOrderSortOptions(sortBy);
  query = applySorting(query, sortOptions);

  return query;
}
