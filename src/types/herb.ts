// Frontend interface using camelCase for consistency
export interface HerbRecord {
  id: string;
  herbName: string;
  farmerName: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  harvestDate: string;
  notes?: string;
  qrCodeUrl?: string;
  createdAt: string;
}