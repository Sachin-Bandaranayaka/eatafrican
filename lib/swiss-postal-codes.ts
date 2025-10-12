// Swiss postal codes database for validation
// This is a subset of major Swiss cities - can be expanded as needed

export interface PostalCodeData {
  postalCode: string;
  city: string;
  canton: string;
  region: string;
}

export const swissPostalCodes: PostalCodeData[] = [
  // Basel area (4000-4999)
  { postalCode: '4000', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4001', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4002', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4051', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4052', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4053', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4054', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4055', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4056', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4057', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4058', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4059', city: 'Basel', canton: 'BS', region: 'basel' },
  { postalCode: '4123', city: 'Allschwil', canton: 'BL', region: 'basel' },
  { postalCode: '4125', city: 'Riehen', canton: 'BS', region: 'basel' },
  { postalCode: '4132', city: 'Muttenz', canton: 'BL', region: 'basel' },
  { postalCode: '4133', city: 'Pratteln', canton: 'BL', region: 'basel' },
  
  // Bern area (3000-3999)
  { postalCode: '3000', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3001', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3003', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3004', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3005', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3006', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3007', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3008', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3010', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3011', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3012', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3013', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3014', city: 'Bern', canton: 'BE', region: 'bern' },
  { postalCode: '3015', city: 'Bern', canton: 'BE', region: 'bern' },
  
  // Zurich area (8000-8999)
  { postalCode: '8000', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8001', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8002', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8003', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8004', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8005', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8006', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8008', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8032', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8037', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8038', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8041', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8044', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8045', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8046', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8047', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8048', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8049', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8050', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8051', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8052', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8053', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8055', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  { postalCode: '8057', city: 'Zürich', canton: 'ZH', region: 'zurich' },
  
  // Geneva area (1200-1299)
  { postalCode: '1200', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1201', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1202', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1203', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1204', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1205', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1206', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1207', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1208', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1209', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1211', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1212', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1213', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1214', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1215', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1216', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1217', city: 'Genève', canton: 'GE', region: 'geneva' },
  { postalCode: '1218', city: 'Genève', canton: 'GE', region: 'geneva' },
  
  // Lausanne area (1000-1099)
  { postalCode: '1000', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1001', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1002', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1003', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1004', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1005', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1006', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1007', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1008', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1010', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1011', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
  { postalCode: '1012', city: 'Lausanne', canton: 'VD', region: 'lausanne' },
];

// Normalize city name for comparison (remove accents, lowercase, trim)
function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

// Validate postal code and city combination
export function validateSwissAddress(postalCode: string, city: string): {
  valid: boolean;
  message?: string;
  suggestions?: string[];
  region?: string;
} {
  // Validate postal code format
  if (!/^\d{4}$/.test(postalCode)) {
    return {
      valid: false,
      message: 'Invalid postal code format. Swiss postal codes must be 4 digits.',
    };
  }

  const normalizedInputCity = normalizeCity(city);
  
  // Find matching postal codes
  const matchingPostalCodes = swissPostalCodes.filter(
    (entry) => entry.postalCode === postalCode
  );

  if (matchingPostalCodes.length === 0) {
    // Postal code not in our database - allow it but warn
    return {
      valid: true,
      message: 'Postal code accepted. Please verify your address is correct.',
      region: getRegionFromPostalCode(postalCode),
    };
  }

  // Check if city matches any of the entries for this postal code
  const cityMatch = matchingPostalCodes.find(
    (entry) => normalizeCity(entry.city) === normalizedInputCity
  );

  if (cityMatch) {
    return {
      valid: true,
      region: cityMatch.region,
    };
  }

  // City doesn't match - provide suggestions
  const suggestions = matchingPostalCodes.map((entry) => entry.city);
  
  return {
    valid: false,
    message: `Postal code ${postalCode} doesn't match "${city}". Did you mean: ${suggestions.join(', ')}?`,
    suggestions,
  };
}

// Get region from postal code for delivery fee calculation
function getRegionFromPostalCode(postalCode: string): string {
  const code = parseInt(postalCode);
  
  if (code >= 4000 && code <= 4999) return 'basel';
  if (code >= 8000 && code <= 8999) return 'zurich';
  if (code >= 3000 && code <= 3999) return 'bern';
  if (code >= 1200 && code <= 1299) return 'geneva';
  if (code >= 1000 && code <= 1099) return 'lausanne';
  
  return 'other';
}

// Calculate delivery fee based on region
export function calculateDeliveryFee(postalCode: string, city: string): number {
  const validation = validateSwissAddress(postalCode, city);
  
  if (!validation.valid) {
    return 6.00; // Default fee for invalid addresses
  }

  const region = validation.region || getRegionFromPostalCode(postalCode);
  
  // Delivery fee by region
  const feeMap: Record<string, number> = {
    basel: 6.00,
    zurich: 8.00,
    bern: 7.00,
    geneva: 9.00,
    lausanne: 8.50,
    other: 10.00,
  };

  return feeMap[region] || 10.00;
}
