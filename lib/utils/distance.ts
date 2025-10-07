/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel time based on distance
 * Assumes average speed of 30 km/h in city
 */
export function estimateTravelTime(distanceKm: number): number {
  const averageSpeedKmh = 30;
  const timeHours = distanceKm / averageSpeedKmh;
  const timeMinutes = Math.ceil(timeHours * 60);
  return timeMinutes;
}

/**
 * Format distance string for display
 * Example: "9 km, 47 min from Olten"
 */
export function formatDistanceString(
  distanceKm: number,
  fromLocation?: string
): string {
  const travelTime = estimateTravelTime(distanceKm);
  const distanceStr = `${distanceKm} km, ${travelTime} min`;
  
  if (fromLocation) {
    return `${distanceStr} from ${fromLocation}`;
  }
  
  return distanceStr;
}

/**
 * Calculate delivery fee based on distance
 * Base fee + per km charge
 */
export function calculateDeliveryFee(distanceKm: number): number {
  const baseFee = 5.0; // CHF
  const perKmFee = 1.5; // CHF per km
  
  const fee = baseFee + (distanceKm * perKmFee);
  return Math.round(fee * 100) / 100; // Round to 2 decimal places
}

/**
 * Check if location is within delivery radius
 */
export function isWithinDeliveryRadius(
  distanceKm: number,
  maxRadiusKm: number = 15
): boolean {
  return distanceKm <= maxRadiusKm;
}

/**
 * Get coordinates from address (placeholder for geocoding service)
 * In production, integrate with Google Maps Geocoding API or similar
 */
export async function geocodeAddress(address: string): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  // TODO: Implement geocoding service integration
  // For now, return null to indicate geocoding is not available
  console.warn('Geocoding not implemented. Address:', address);
  return null;
}

/**
 * Calculate bounding box for a given center point and radius
 * Useful for database queries to find nearby locations
 */
export function getBoundingBox(
  centerLat: number,
  centerLon: number,
  radiusKm: number
): {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
} {
  const latDelta = radiusKm / 111; // 1 degree latitude ≈ 111 km
  const lonDelta = radiusKm / (111 * Math.cos(toRadians(centerLat)));

  return {
    minLat: centerLat - latDelta,
    maxLat: centerLat + latDelta,
    minLon: centerLon - lonDelta,
    maxLon: centerLon + lonDelta,
  };
}
