import { supabaseAdmin } from './config';
import type { Database } from './types';

// Type-safe database client
export const db = supabaseAdmin;

// Helper function to execute queries with error handling
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const { data, error } = await queryFn();
  
  if (error) {
    console.error('Database query error:', error);
    throw new Error(error.message || 'Database query failed');
  }
  
  if (!data) {
    throw new Error('No data returned from query');
  }
  
  return data;
}

// Helper function for transactions
export async function withTransaction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    const result = await callback();
    return result;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

// Pagination helper
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  return { page, limit, from, to };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

// Query builder helpers
export function buildSearchQuery(searchTerm?: string) {
  if (!searchTerm) return undefined;
  return `%${searchTerm.toLowerCase()}%`;
}

export function buildArrayContainsQuery(values?: string[]) {
  if (!values || values.length === 0) return undefined;
  return values;
}

// Date range helpers
export function buildDateRangeQuery(startDate?: string, endDate?: string) {
  const filters: any = {};
  
  if (startDate) {
    filters.gte = new Date(startDate).toISOString();
  }
  
  if (endDate) {
    filters.lte = new Date(endDate).toISOString();
  }
  
  return Object.keys(filters).length > 0 ? filters : undefined;
}
