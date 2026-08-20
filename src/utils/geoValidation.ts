import maduraiSouthGeoJson from '../data/maduraiSouthBoundary.json';
import { MADURAI_SOUTH_WARDS } from '../data/maduraiSouthWards';
import { WardInfo } from '../types';

/**
 * Ray-casting Point in Polygon algorithm for exact boundary checks.
 * Polygon coordinates format: [[lng, lat], ...]
 */
function pointInPolygon(point: [number, number], vs: number[][]): boolean {
  const x = point[0]; // lng
  const y = point[1]; // lat
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export interface ValidationResult {
  isValid: boolean;
  constituencyNameEn: string;
  constituencyNameTa: string;
  detectedWard: WardInfo;
  distanceFromCenterKm?: number;
}

const CONSTITUENCY_POLYGON = maduraiSouthGeoJson.features[0].geometry.coordinates[0];

export function validateMaduraiSouthLocation(lat: number, lng: number): ValidationResult {
  // Check if point [lng, lat] is inside the Madurai South Polygon
  const isInside = pointInPolygon([lng, lat], CONSTITUENCY_POLYGON);

  // Simple Ward assignment logic based on position relative to key landmarks
  let wardIndex = 0;
  if (lat > 9.925) {
    wardIndex = lng < 78.130 ? 0 : 3; // Simmakkal vs Anna Nagar West
  } else if (lat > 9.915) {
    if (lng < 78.125) wardIndex = 1; // Rajamahal Silks
    else if (lng < 78.140) wardIndex = 2; // Thirumalai Nayakkar Mahal / Kamarajar Salai
    else wardIndex = 6; // Teppakulam
  } else if (lat > 9.905) {
    if (lng < 78.135) wardIndex = 4; // Kamarajar Salai South
    else if (lng < 78.150) wardIndex = 7; // Anuppanadi Central
    else wardIndex = 8; // Anuppanadi East
  } else {
    if (lng < 78.125) wardIndex = 9; // Villapuram Main
    else if (lng < 78.140) wardIndex = 10; // Vetri Cinema
    else wardIndex = 11; // Munichalai Road
  }

  const detectedWard = MADURAI_SOUTH_WARDS[wardIndex % MADURAI_SOUTH_WARDS.length];

  return {
    isValid: isInside,
    constituencyNameEn: "192 - Madurai South Assembly Constituency",
    constituencyNameTa: "192 - மதுரை தெற்கு சட்டமன்ற தொகுதி",
    detectedWard
  };
}

/**
 * Reverse geocoding helper simulation for Madurai South landmark addresses
 */
export function getAddressFromCoords(lat: number, lng: number): string {
  if (lat > 9.925) {
    return "Near Simmakkal Signal, North Veli Street, Madurai South - 625001";
  } else if (lat > 9.915 && lng < 78.130) {
    return "Near Thirumalai Nayakkar Mahal, Mahal Area, Madurai South - 625001";
  } else if (lat > 9.915 && lng >= 78.130) {
    return "Near Mariamman Kovil Teppakulam, Kamarajar Salai, Madurai South - 625009";
  } else if (lat <= 9.915 && lng >= 78.140) {
    return "Anuppanadi Main Road, Housing Board Colony, Madurai South - 625009";
  } else {
    return "Villapuram Main Road, Near Vetri Theatre, Madurai South - 625012";
  }
}
