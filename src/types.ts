export type RoomVerdict = 'love_it' | 'maybe' | 'skip';

export interface Property {
  id: string;
  name: string;        // e.g., "Pacific Stars"
  location: string;    // e.g., "Section 13, PJ, Malaysia"
  overallNotes: string;
  dateCreated: string;
}

export type AspectID = 'rent' | 'aircon' | 'bathroom' | 'furnishings' | 'space' | 'wifi' | 'kitchen' | 'illumination';

export interface RoomAspect {
  id: AspectID;
  name: string;        // e.g., "Rent & Bill Coverage", "Attached/Shared Bathroom"
  description: string;
  rating: number;      // 1 to 5 star rating
  notes: string;
  photo?: string;      // Base64 compressed JPEG
  photoDate?: string;
}

export interface Room {
  id: string;
  propertyId: string;  // references Property.id
  name: string;         // e.g., "Master Bedroom with Ensuite", "Cozy Middle Balcony Room"
  rentPrice: number;    // RM rent price
  depositRequired: string; // e.g., "2.5 Months"
  sizeSqft?: string;    // e.g. "150 sqft"
  generalNotes: string;
  aspects: RoomAspect[];
  verdict: RoomVerdict;
  dateInspected: string;
}

export interface DefaultAspectTemplate {
  id: AspectID;
  name: string;
  description: string;
}

export const ROOM_ASPECT_TEMPLATES: DefaultAspectTemplate[] = [
  {
    id: 'rent',
    name: 'Rent Cost & Utility Bills',
    description: 'Is rent worth the price? Are electricity (with submeter?), water, and aircon bills fully capped or split?'
  },
  {
    id: 'aircon',
    name: 'Air Conditioner & Ventilation',
    description: 'Test cooling power, blower sound levels, remote work, or mold warnings in Malaysia\'s humid climate.'
  },
  {
    id: 'bathroom',
    name: 'Bathroom & Water Heater Check',
    description: 'Verify toilet flushing force, water heater safety, basin leaks, and drain flow rate.'
  },
  {
    id: 'furnishings',
    name: 'Furnishings, Wardrobe & Bed',
    description: 'Check mattress comfort, study desk usability, door sliders, and cupboard mold risks.'
  },
  {
    id: 'space',
    name: 'Room Space, Ceiling & Balcony',
    description: 'Inspect layout spacing, security locks on sliding doors, clothes hanging lines, and window viewpoints.'
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Signal Strength',
    description: 'Is high-speed wireless coverage stable? Test with online pages or video uploads from inside this room.'
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Shared Laundries',
    description: 'Check fridge compartments, dry cooking safety, washing machines, and water filtration access.'
  },
  {
    id: 'illumination',
    name: 'Lighting & Quietness',
    description: 'Review daytime natural light exposure and outdoor street noise/highway disturbance levels.'
  }
];
