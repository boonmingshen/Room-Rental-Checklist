import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Plus, 
  Scale, 
  FileText, 
  Trash2, 
  Sparkles,
  Camera,
  Star,
  MapPin,
  MessageSquare,
  DollarSign,
  User,
  Heart,
  ChevronRight,
  Database,
  ArrowRight,
  Sparkle,
  X,
  Smartphone,
  Eye,
  Info
} from 'lucide-react';
import { 
  Property, 
  Room, 
  RoomAspect, 
  ROOM_ASPECT_TEMPLATES, 
  RoomVerdict 
} from './types';
import RoomAspectCard from './components/RoomAspectCard';
import CompareView from './components/CompareView';
import ExportModal from './components/ExportModal';
import { getStorageStats } from './utils/imageCompressor';

// Pre-seeded Properties in Malaysia representing "Pacific Stars"
const SEED_PROPERTIES: Property[] = [
  {
    id: 'prop_pacific',
    name: 'Pacific Stars, Petaling Jaya',
    location: 'Section 13, Petaling Jaya, Selangor, Malaysia',
    overallNotes: 'Perfect placement for university students and PJ professionals. Right opposite Jaya One Mall. High security, premium swimming pool facilities, and rapid fibre Wi-Fi coverage.',
    dateCreated: '2026-06-02'
  }
];

// Seeded Rooms inside Pacific Stars
const SEED_ROOMS: Room[] = [
  {
    id: 'room_master',
    propertyId: 'prop_pacific',
    name: 'Master Suite (Attached Bathroom)',
    rentPrice: 950,
    depositRequired: '2.5 Months (RM 2375)',
    sizeSqft: '180 sqft',
    generalNotes: 'Very premium. Private attached bathroom with silent heater. Newly painted walls.',
    verdict: 'love_it',
    dateInspected: '2026-06-02',
    aspects: [
      { id: 'rent', name: 'Rent Cost & Utility Bills', description: 'Is rent worth the price? Are electricity, water, and aircon bills capped or split?', rating: 4, notes: 'Includes premium water filtration and high speed Wi-Fi. Aircon split-meter.' },
      { id: 'aircon', name: 'Air Conditioner & Ventilation', description: 'Test cooling power, blower sound levels, remote work, or mold warnings.', rating: 5, notes: 'Brand new Daikin unit. Cold within 2 minutes! Super silent operation.' },
      { id: 'bathroom', name: 'Bathroom & Water Heater Check', description: 'Verify toilet flushing force, water heater safety, basin leaks, and drain flow rate.', rating: 5, notes: 'Attached private bathroom is pristine. Water heater has superb high pressure.' },
      { id: 'furnishings', name: 'Furnishings, Wardrobe & Bed', description: 'Check mattress comfort, study desk usability, door sliders, and cupboard mold risks.', rating: 4, notes: 'King sized bed. High quality study desk provided.' },
      { id: 'space', name: 'Room Space, Ceiling & Balcony', description: 'Inspect layout spacing, security locks on sliding doors, clothes hanging lines, and window viewpoints.', rating: 4, notes: 'Spacious. Plenty of walk-around room even with massive desk.' },
      { id: 'wifi', name: 'Wi-Fi Signal Strength', description: 'Is high-speed wireless coverage stable? Test with online pages or video uploads.', rating: 5, notes: 'Excellent coverage. Speed check gets around 150 Mbps inside room.' },
      { id: 'kitchen', name: 'Kitchen & Shared Laundries', description: 'Check fridge compartments, dry cooking safety, washing machines, and water filtration access.', rating: 4, notes: 'Separate private cabinet allocated in shared kitchen area.' },
      { id: 'illumination', name: 'Lighting & Quietness', description: 'Review daytime natural light exposure and outdoor street noise/highway disturbance levels.', rating: 4, notes: 'Facing internal quiet garden patio rather than noisy highway.' }
    ]
  },
  {
    id: 'room_balcony',
    propertyId: 'prop_pacific',
    name: 'Medium Room with Private Balcony',
    rentPrice: 800,
    depositRequired: '2.5 Months (RM 2000)',
    sizeSqft: '140 sqft',
    generalNotes: 'Stunning floor-to-ceiling balcony door. Best natural breeze in the units.',
    verdict: 'love_it',
    dateInspected: '2026-06-01',
    aspects: [
      { id: 'rent', name: 'Rent Cost & Utility Bills', description: 'Is rent worth the price? Are electricity, water, and aircon bills capped or split?', rating: 5, notes: 'Remarkable price for high-floor private balcony. Standard rent excludes aircon run.' },
      { id: 'aircon', name: 'Air Conditioner & Ventilation', description: 'Test cooling power, blower sound levels, remote work, or mold warnings.', rating: 4, notes: 'Highly effective Panasonic. Cools quickly.' },
      { id: 'bathroom', name: 'Bathroom & Water Heater Check', description: 'Verify toilet flushing force, water heater safety, basin leaks, and drain flow rate.', rating: 3, notes: 'Shared bathroom with small room. Cleanliness is average, basic plumbing is good.' },
      { id: 'furnishings', name: 'Furnishings, Wardrobe & Bed', description: 'Check mattress comfort, study desk usability, door sliders, and cupboard mold risks.', rating: 4, notes: 'Queen model. Wardrobe slider runs nicely.' },
      { id: 'space', name: 'Room Space, Ceiling & Balcony', description: 'Inspect layout spacing, security locks on sliding doors, clothes hanging lines, and window viewpoints.', rating: 5, notes: 'Beautiful breezy balcony with sliding key-lock.' },
      { id: 'wifi', name: 'Wi-Fi Signal Strength', description: 'Is high-speed wireless coverage stable? Test with online pages or video uploads.', rating: 4, notes: 'Strong stable 2.4GHz and 5GHz dual bands.' },
      { id: 'kitchen', name: 'Kitchen & Shared Laundries', description: 'Check fridge compartments, dry cooking safety, washing machines, and water filtration access.', rating: 4, notes: 'Good. Stove is clean.' },
      { id: 'illumination', name: 'Lighting & Quietness', description: 'Review daytime natural light exposure and outdoor street noise/highway disturbance levels.', rating: 5, notes: 'Superb daylight factor. Beautiful Malaysia sunset views.' }
    ]
  },
  {
    id: 'room_budget',
    propertyId: 'prop_pacific',
    name: 'Cozy Budget Single Room',
    rentPrice: 550,
    depositRequired: '2.5 Months (RM 1375)',
    sizeSqft: '90 sqft',
    generalNotes: 'Fitted interior partition layout. Extremely tidy and cozy for a single student.',
    verdict: 'maybe',
    dateInspected: '2026-05-28',
    aspects: [
      { id: 'rent', name: 'Rent Cost & Utility Bills', description: 'Is rent worth the price? Are electricity, water, and aircon bills capped or split?', rating: 5, notes: 'Fantastic cost-efficiency for budget hunters in PJ!' },
      { id: 'aircon', name: 'Air Conditioner & Ventilation', description: 'Test cooling power, blower sound levels, remote work, or mold warnings.', rating: 3, notes: 'A bit noisy, but functions. Air filtration filter is clean.' },
      { id: 'bathroom', name: 'Bathroom & Water Heater Check', description: 'Verify toilet flushing force, water heater safety, basin leaks, and drain flow rate.', rating: 3, notes: 'Shared corridor toilet toilet. Water pressure is normal.' },
      { id: 'furnishings', name: 'Furnishings, Wardrobe & Bed', description: 'Check mattress comfort, study desk usability, door sliders, and cupboard mold risks.', rating: 4, notes: 'Fitted single bed with metal framework.' },
      { id: 'space', name: 'Room Space, Ceiling & Balcony', description: 'Inspect layout spacing, security locks on sliding doors, clothes hanging lines, and window viewpoints.', rating: 3, notes: 'Compact but highly usable, clothing rod can fit inside.' },
      { id: 'wifi', name: 'Wi-Fi Signal Strength', description: 'Is high-speed wireless coverage stable? Test with online pages or video uploads.', rating: 4, notes: 'Router sits in close proximity in the living room.' },
      { id: 'kitchen', name: 'Kitchen & Shared Laundries', description: 'Check fridge compartments, dry cooking safety, washing machines, and water filtration access.', rating: 3, notes: 'Standard.' },
      { id: 'illumination', name: 'Lighting & Quietness', description: 'Review daytime natural light exposure and outdoor street noise/highway disturbance levels.', rating: 2, notes: 'Internal ventilation window only. Requires electric lighting on during daytime.' }
    ]
  }
];

export default function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  
  // iOS Device Mockup Tab Bar
  const [activeTab, setActiveTab] = useState<'properties' | 'rooms' | 'compare' | 'export'>('rooms');
  
  // Modal controllers
  const [isNewPropModalOpen, setIsNewPropModalOpen] = useState(false);
  const [isNewRoomModalOpen, setIsNewRoomModalOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // New property form states
  const [tempPropName, setTempPropName] = useState('');
  const [tempPropLoc, setTempPropLoc] = useState('');
  const [tempPropNotes, setTempPropNotes] = useState('');

  // New room form states
  const [tempRoomName, setTempRoomName] = useState('');
  const [tempRoomPrice, setTempRoomPrice] = useState(700);
  const [tempRoomDeposit, setTempRoomDeposit] = useState('2.5 Months');
  const [tempRoomSize, setTempRoomSize] = useState('120 sqft');
  const [tempRoomNotes, setTempRoomNotes] = useState('');
  const [tempRoomVerdict, setTempRoomVerdict] = useState<RoomVerdict>('maybe');

  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState(getStorageStats());

  // Bootstrap initial property & rooms from localStorage
  useEffect(() => {
    const cachedProps = localStorage.getItem('ROOM_RENT_PROPS');
    const cachedRooms = localStorage.getItem('ROOM_RENT_ROOMS');

    if (cachedProps && cachedRooms) {
      try {
        const parsedProps = JSON.parse(cachedProps);
        const parsedRooms = JSON.parse(cachedRooms);
        setProperties(parsedProps);
        setRooms(parsedRooms);
        
        if (parsedProps.length > 0) {
          setSelectedPropertyId(parsedProps[0].id);
          const related = parsedRooms.filter((r: Room) => r.propertyId === parsedProps[0].id);
          if (related.length > 0) {
            setSelectedRoomId(related[0].id);
          }
        }
      } catch (err) {
        console.error("Local Storage parse fallback:", err);
        setProperties(SEED_PROPERTIES);
        setRooms(SEED_ROOMS);
        setSelectedPropertyId(SEED_PROPERTIES[0].id);
        setSelectedRoomId(SEED_ROOMS[0].id);
      }
    } else {
      // Seed default rooms at Pacific Stars Petaling Jaya
      localStorage.setItem('ROOM_RENT_PROPS', JSON.stringify(SEED_PROPERTIES));
      localStorage.setItem('ROOM_RENT_ROOMS', JSON.stringify(SEED_ROOMS));
      setProperties(SEED_PROPERTIES);
      setRooms(SEED_ROOMS);
      setSelectedPropertyId(SEED_PROPERTIES[0].id);
      setSelectedRoomId(SEED_ROOMS[0].id);
    }
  }, []);

  const saveToDisk = (updatedProps: Property[], updatedRooms: Room[]) => {
    setProperties(updatedProps);
    setRooms(updatedRooms);
    localStorage.setItem('ROOM_RENT_PROPS', JSON.stringify(updatedProps));
    localStorage.setItem('ROOM_RENT_ROOMS', JSON.stringify(updatedRooms));
    // Trigger tick for storage estimation
    setTimeout(() => {
      setStorageStats(getStorageStats());
    }, 100);
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPropName.trim()) {
      alert("Property name is mandatory.");
      return;
    }
    const newProp: Property = {
      id: `prop_${Date.now()}`,
      name: tempPropName.trim(),
      location: tempPropLoc.trim() || 'Malaysia',
      overallNotes: tempPropNotes.trim(),
      dateCreated: new Date().toLocaleDateString()
    };
    const nextProps = [...properties, newProp];
    saveToDisk(nextProps, rooms);
    setSelectedPropertyId(newProp.id);
    setIsNewPropModalOpen(false);
    
    // Clear temp states
    setTempPropName('');
    setTempPropLoc('');
    setTempPropNotes('');
    alert(`Successfully launched property: ${newProp.name}! Now add some room inspect logs to it.`);
    setActiveTab('rooms');
  };

  const handleDeleteProperty = (propId: string) => {
    if (confirm("Delete this property profile and all its rooms inspect data forever?")) {
      const nextProps = properties.filter(p => p.id !== propId);
      const nextRooms = rooms.filter(r => r.propertyId !== propId);
      saveToDisk(nextProps, nextRooms);
      
      const remainingId = nextProps[0]?.id || '';
      setSelectedPropertyId(remainingId);
      if (remainingId) {
        const remainingRooms = nextRooms.filter(r => r.propertyId === remainingId);
        setSelectedRoomId(remainingRooms[0]?.id || '');
      } else {
        setSelectedRoomId('');
      }
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempRoomName.trim()) {
      alert("Room name/reference is required.");
      return;
    }
    if (!selectedPropertyId) {
      alert("Select high-level property context first.");
      return;
    }

    const newRoom: Room = {
      id: `room_${Date.now()}`,
      propertyId: selectedPropertyId,
      name: tempRoomName.trim(),
      rentPrice: Math.max(1, tempRoomPrice),
      depositRequired: tempRoomDeposit.trim() || '2.5 Months',
      sizeSqft: tempRoomSize.trim() || '120 sqft',
      generalNotes: tempRoomNotes.trim(),
      verdict: tempRoomVerdict,
      dateInspected: new Date().toLocaleDateString(),
      // Pre-populate with deep aspects template ready for scoring
      aspects: ROOM_ASPECT_TEMPLATES.map(tpl => ({
        id: tpl.id,
        name: tpl.name,
        description: tpl.description,
        rating: 0,
        notes: ''
      }))
    };

    const nextRooms = [newRoom, ...rooms];
    saveToDisk(properties, nextRooms);
    setSelectedRoomId(newRoom.id);
    setIsNewRoomModalOpen(false);

    // Reset forms
    setTempRoomName('');
    setTempRoomPrice(700);
    setTempRoomDeposit('2.5 Months');
    setTempRoomSize('120 sqft');
    setTempRoomNotes('');
    setTempRoomVerdict('maybe');
    alert(`Added "${newRoom.name}"! Scroll down to rate aspects or snap photos.`);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Permanently erase this room log and its photo files?")) {
      const nextRooms = rooms.filter(r => r.id !== roomId);
      saveToDisk(properties, nextRooms);
      
      const related = nextRooms.filter(r => r.propertyId === selectedPropertyId);
      setSelectedRoomId(related[0]?.id || '');
    }
  };

  // Update specific aspects (scores, notes, photo captures)
  const handleUpdateAspect = (roomId: string, aspectId: string, updates: Partial<RoomAspect>) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          aspects: room.aspects.map(aspect => {
            if (aspect.id === aspectId) {
              return { ...aspect, ...updates };
            }
            return aspect;
          })
        };
      }
      return room;
    });
    saveToDisk(properties, updatedRooms);
  };

  const handleUpdateRoomMeta = (roomId: string, updates: Partial<Room>) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, ...updates };
      }
      return room;
    });
    saveToDisk(properties, updatedRooms);
  };

  const activeProperty = properties.find(p => p.id === selectedPropertyId);
  const activePropertyRooms = rooms.filter(r => r.propertyId === selectedPropertyId);
  const activeRoom = activePropertyRooms.find(r => r.id === selectedRoomId);

  // Calculate overall averages
  const getAverageStars = (room: Room) => {
    const ratedAspects = room.aspects.filter(a => a.rating > 0);
    if (ratedAspects.length === 0) return 0;
    const sum = ratedAspects.reduce((acc, a) => acc + a.rating, 0);
    return Number((sum / ratedAspects.length).toFixed(1));
  };

  return (
    <div className="min-h-screen bg-slate-900 md:bg-slate-950 flex flex-col items-center justify-start py-0 md:py-12 px-0 md:px-4 font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Dynamic Title Header on Wide screens */}
      <div className="hidden md:flex flex-col items-center justify-center mb-8 max-w-xl text-center text-slate-400 select-none space-y-2">
        <h1 className="text-3xl font-serif font-black tracking-tight text-white flex items-center gap-2">
          Room Scout Auditor
        </h1>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
          Targeted iPhone preview environment. Inspect Multiple Rooms at <strong>Pacific Stars, Malaysia</strong>. Capture camera proofs, rate stellar scores, and lock printable PDF binders.
        </p>
      </div>

      {/* 📱 NATIVE IPHONE 15 PHYSICAL FRAME EMULATOR ON DESKTOP */}
      <div className="relative w-full md:max-w-[420px] bg-slate-900 border-0 md:border-[12px] border-slate-800 md:rounded-[55px] md:shadow-2xl md:ring-1 md:ring-slate-700/50 flex flex-col md:h-[844px] overflow-hidden">
        
        {/* Dynamic Island cutout at the top - Hidden on mobile screens */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6.5 bg-black rounded-full z-50 flex items-center justify-center gap-1.5 px-3 pointer-events-none hidden md:flex">
          {/* Simulated small lens shine detail */}
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900/60 ml-auto border border-slate-950" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
        </div>

        {/* Top iOS mockup status bar inside viewport screen */}
        <div className="bg-white/80 backdrop-blur-md flex justify-between items-center px-6 pt-3 pb-2 text-[11px] font-bold text-slate-700 font-sans z-40 select-none shrink-0 pointer-events-none md:pt-4">
          <span>11:24</span>
          
          <div className="flex items-center gap-1.5 text-slate-800">
            {/* Battery / Wifi Bar mockup icons */}
            <span className="text-[9px] font-mono tracking-tighter">5G</span>
            <div className="flex items-end gap-[1.5px] h-2.5">
              <span className="w-[2px] h-[3px] bg-slate-800 rounded-[1px]" />
              <span className="w-[2px] h-[5px] bg-slate-800 rounded-[1px]" />
              <span className="w-[2px] h-[7px] bg-slate-800 rounded-[1px]" />
              <span className="w-[2px] h-2.5 bg-slate-800 rounded-[1px]" />
            </div>
            {/* Battery layout info */}
            <div className="w-5 h-[11px] border border-slate-800/80 rounded-sm p-[1px] flex items-center">
              <div className="bg-emerald-500 h-full w-[92%] rounded-xs" />
            </div>
          </div>
        </div>

        {/* 📱 SCROLLABLE APP SCREEN CANVAS */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative pb-32">
          
          {/* SCREEN CONTENT - TAB BRANCHES */}

          {/* TAB 1: PROPERTIES PORTFOLIOS */}
          {activeTab === 'properties' && (
            <div className="p-4 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <h3 className="font-serif font-black text-slate-800 text-lg">Inspected Houses</h3>
                <button
                  type="button"
                  onClick={() => setIsNewPropModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full cursor-pointer transition shadow-xs"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="text-center p-8 bg-white border border-slate-100 rounded-2xl space-y-3">
                  <span className="text-xs text-slate-400 block">No properties audited</span>
                  <button 
                    onClick={() => setIsNewPropModalOpen(true)}
                    className="bg-emerald-600 text-white px-3 py-1.5 text-xs rounded-xl font-bold font-sans"
                  >
                    Add Property Name
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {properties.map(prop => {
                    const roomCount = rooms.filter(r => r.propertyId === prop.id).length;
                    const isSelected = selectedPropertyId === prop.id;
                    return (
                      <div 
                        key={prop.id}
                        onClick={() => setSelectedPropertyId(prop.id)}
                        className={`p-4 rounded-2xl border transition duration-150 cursor-pointer ${
                          isSelected 
                            ? 'bg-white border-emerald-500 ring-2 ring-emerald-50/50' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 italic">
                              House Profile
                            </span>
                            <h4 className="font-serif font-black text-slate-800 text-base mt-2">{prop.name}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin size={11} className="text-rose-500" />
                              {prop.location || 'Malaysia'}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg">
                              {roomCount} {roomCount === 1 ? 'room' : 'rooms'}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProperty(prop.id);
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 rounded transition"
                              title="Delete Completely"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {prop.overallNotes && (
                          <p className="text-[11px] text-slate-500 italic mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            "{prop.overallNotes}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Reset seed details helper */}
              <div className="bg-slate-100 border border-slate-200/50 p-4 rounded-2xl space-y-2 font-sans mt-4">
                <span className="text-xs font-bold text-slate-600 block">Database Storage Status</span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Total camera uploads and notes storage capacity utilized: <strong>{storageStats.percentUsed}%</strong> of 5MB browser sandbox.
                </p>
                <div className="flex gap-2 pt-1.5">
                  <button
                    onClick={() => {
                      if (confirm("Reset layout data back to initial Pacific Stars sample values? Your custom unsaved modifications will be fully erased.")) {
                        localStorage.removeItem('ROOM_RENT_PROPS');
                        localStorage.removeItem('ROOM_RENT_ROOMS');
                        window.location.reload();
                      }
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset to Malaysia Demo Seeds
                  </button>
                  <span className="text-slate-300">|</span>
                  <label className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer">
                    Upload External Database
                    <input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          try {
                            const parsed = JSON.parse(evt.target?.result as string);
                            if (parsed && Array.isArray(parsed.rooms)) {
                              saveToDisk(parsed.property ? [parsed.property] : SEED_PROPERTIES, parsed.rooms);
                              alert("Database restored successfully!");
                              window.location.reload();
                            } else {
                              alert("Incompatible layout. Make sure this file has parsed .json specifications.");
                            }
                          } catch (_) { alert("JSON parsing error."); }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROOM INSPECTOR PANEL */}
          {activeTab === 'rooms' && (
            <div className="p-4 space-y-4 animate-fade-in">
              {/* Header Selector info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 font-sans space-y-2.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-extrabold">Active Complex Workspace</span>
                    <h3 className="font-serif font-black text-slate-800 text-base leading-tight">
                      {activeProperty?.name || "No House Profile Selected"}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="text-[10px] font-bold text-emerald-600 hover:underline bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Rooms Selection List with carousel tabs */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-sans">
                    Inspected Rooms ({activePropertyRooms.length})
                  </span>

                  <button
                    onClick={() => setIsNewRoomModalOpen(true)}
                    className="text-xs font-bold text-emerald-600 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-xl"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                    <span>Add Room</span>
                  </button>
                </div>

                {activePropertyRooms.length === 0 ? (
                  <div className="text-center p-8 bg-white border border-slate-100 rounded-2xl">
                    <p className="text-xs text-slate-400">No rooms tracked yet inside {activeProperty?.name}</p>
                  </div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x font-sans">
                    {activePropertyRooms.map((room) => {
                      const isSelected = selectedRoomId === room.id;
                      const averageValue = getAverageStars(room);
                      
                      return (
                        <button
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`p-3 rounded-xl border text-left shrink-0 min-w-[130px] transition duration-150 cursor-pointer snap-start ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-950 text-white shadow-xs' 
                              : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-[9px] font-bold opacity-75 block capitalize">Rent: RM {room.rentPrice}</span>
                          <span className="text-xs font-bold block truncate mt-0.5">{room.name}</span>
                          <div className="flex items-center gap-1 mt-1 text-amber-400 text-[10px] font-extrabold">
                            <Star size={10} className="fill-current" />
                            <span>{averageValue > 0 ? averageValue : 'Pending'}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Room Audit Sheets */}
              {activeRoom ? (
                <div className="space-y-4 font-sans">
                  
                  {/* Selected Room Metadata panel */}
                  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-xs">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase">
                          Room Specs
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">{activeRoom.name}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteRoom(activeRoom.id)}
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-lg"
                        title="Delete Room"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Meta Spec Inputs */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-50">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Monthly Cost</label>
                        <div className="relative rounded-lg overflow-hidden border border-slate-200">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">RM</span>
                          <input 
                            type="number" 
                            value={activeRoom.rentPrice}
                            onChange={(e) => handleUpdateRoomMeta(activeRoom.id, { rentPrice: Number(e.target.value) })}
                            className="bg-slate-50/50 w-full pl-9 pr-2.5 py-1.5 focus:bg-white focus:outline-hidden text-slate-800 font-bold font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Deposit Info</label>
                        <input 
                          type="text" 
                          value={activeRoom.depositRequired}
                          onChange={(e) => handleUpdateRoomMeta(activeRoom.id, { depositRequired: e.target.value })}
                          className="bg-slate-50/50 border border-slate-200 rounded-lg w-full px-2.5 py-1.5 focus:bg-white focus:outline-hidden text-slate-700 font-medium text-[11px]"
                          placeholder="E.g., 2.5 Months"
                        />
                      </div>
                    </div>

                    {/* Room space and decision status verdict slider */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Room Size</label>
                        <input 
                          type="text" 
                          value={activeRoom.sizeSqft || ''}
                          onChange={(e) => handleUpdateRoomMeta(activeRoom.id, { sizeSqft: e.target.value })}
                          className="bg-slate-50/50 border border-slate-200 rounded-lg w-full px-2.5 py-1.5 focus:bg-white focus:outline-hidden text-slate-700 font-medium text-[11px]"
                          placeholder="E.g., 140 sqft"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Decision Verdict</label>
                        <select
                          value={activeRoom.verdict}
                          onChange={(e) => handleUpdateRoomMeta(activeRoom.id, { verdict: e.target.value as RoomVerdict })}
                          className="bg-slate-50/50 border border-slate-200 rounded-lg w-full px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 focus:outline-hidden focus:bg-white"
                        >
                          <option value="love_it">🔥 Love It</option>
                          <option value="maybe">⚖️ Maybe</option>
                          <option value="skip">✖ Skip</option>
                        </select>
                      </div>
                    </div>

                    {/* General comments area */}
                    <div className="pt-2 border-t border-slate-50">
                      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Inspection Overview Comments</label>
                      <textarea
                        value={activeRoom.generalNotes}
                        onChange={(e) => handleUpdateRoomMeta(activeRoom.id, { generalNotes: e.target.value })}
                        placeholder="Type layout overall comments or contract duration warnings..."
                        rows={1}
                        className="w-full text-xs bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-slate-300 focus:ring-0 rounded-lg px-2.5 py-1.5 text-slate-700 resize-none min-h-[32px] outline-hidden placeholder:text-slate-400 leading-normal"
                      />
                    </div>
                  </div>

                  {/* ACTIVE ASPECT RATINGS MATRIX CARD LIST - TAKE PICTURE, RATE THE RATING */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1">
                      <Plus className="text-emerald-600" size={15} />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                        Fitted Facilities Rating Matrix
                      </span>
                    </div>

                    <div className="space-y-3">
                      {activeRoom.aspects.map((aspect) => (
                        <RoomAspectCard
                          key={aspect.id}
                          aspect={aspect}
                          onUpdate={(aspectUpdates) => handleUpdateAspect(activeRoom.id, aspect.id, aspectUpdates)}
                          setFullscreenPhoto={setFullscreenPhoto}
                        />
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM EXPORT BUTTON ROW ON ACTIVE ROOMS */}
                  <div className="pt-4 flex flex-col gap-2">
                    <button
                      onClick={() => setIsDossierOpen(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3.5 rounded-2xl shadow-xs transition duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText size={15} />
                      Compile Complete PDF Report
                    </button>
                  </div>

                </div>
              ) : (
                <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 space-y-3">
                  <Info className="mx-auto text-amber-500" size={24} />
                  <h4 className="font-bold text-slate-800 text-sm">No Rooms Audited</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Please use the "+ Add Room" button at the top to record details.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SIDE-BY-SIDE MATRIX COMPILER */}
          {activeTab === 'compare' && (
            <div className="p-4 animate-fade-in font-sans">
              <CompareView 
                properties={properties}
                rooms={rooms}
                selectedPropertyId={selectedPropertyId}
              />
            </div>
          )}

          {/* TAB 4: DOSSIER PDF REPORT RELEASES */}
          {activeTab === 'export' && (
            <div className="p-4 space-y-4 animate-fade-in font-sans">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs text-center space-y-4">
                <FileText className="mx-auto text-emerald-600" size={36} />
                <div className="space-y-1">
                  <h3 className="font-serif font-black text-slate-800 text-base">Compile PDF Binders</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Ready to output details? Confirm observations, type custom digital receipt initials, and launch PDF generation.
                  </p>
                </div>

                {activeProperty ? (
                  <button
                    onClick={() => setIsDossierOpen(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-3.5 rounded-xl transition cursor-pointer"
                  >
                    Launch PDF Release Modal
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic block">No active property loaded.</span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 📱 iOS CUPERTINO SLEEK BOTTOM NAVIGATION TAB BAR */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-2 flex items-center justify-around z-40 select-none pb-5 text-slate-600">
          
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'properties' ? 'text-emerald-600 scale-105' : 'hover:text-slate-800'
            }`}
          >
            <Home size={18} className={activeTab === 'properties' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[9px] font-bold tracking-tight">Houses</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'rooms' ? 'text-emerald-600 scale-105' : 'hover:text-slate-800'
            }`}
          >
            <Camera size={18} className={activeTab === 'rooms' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[9px] font-bold tracking-tight">Inspector</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('compare');
            }}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'compare' ? 'text-emerald-600 scale-105' : 'hover:text-slate-800'
            }`}
          >
            <Scale size={18} className={activeTab === 'compare' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[9px] font-bold tracking-tight">Compare</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('export');
            }}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'export' ? 'text-emerald-600 scale-105' : 'hover:text-slate-800'
            }`}
          >
            <FileText size={18} className={activeTab === 'export' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
            <span className="text-[9px] font-bold tracking-tight">PDF Report</span>
          </button>
        </div>

        {/* iOS physical home button indicator pill bar at the absolute center bottom */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-50 pointer-events-none hidden md:block" />

      </div>

      {/* MODAL 1: ADD NEW PROPERTY / RESIDENCE PROFILE */}
      {isNewPropModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col font-sans">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Home size={15} className="text-emerald-600" /> Start Custom Property Portfolio
              </h4>
              <button 
                onClick={() => setIsNewPropModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Property Name / Condominium *</label>
                <input 
                  type="text"
                  required
                  value={tempPropName}
                  onChange={(e) => setTempPropName(e.target.value)}
                  placeholder="E.g., Pacific Stars"
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">State / Location Landmark</label>
                <input 
                  type="text"
                  value={tempPropLoc}
                  onChange={(e) => setTempPropLoc(e.target.value)}
                  placeholder="E.g., Section 13, PJ, Malaysia"
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Portfolio Notes</label>
                <textarea 
                  value={tempPropNotes}
                  onChange={(e) => setTempPropNotes(e.target.value)}
                  placeholder="E.g., Near LRT train, mature food courts around..."
                  rows={2}
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => setIsNewPropModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Confirm House Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW ROOM INSPECTION SHEET */}
      {isNewRoomModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col font-sans">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Camera size={15} className="text-emerald-600" /> Start Room Auditing Log
              </h4>
              <button 
                onClick={() => setIsNewRoomModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-slate-200/50 rounded-full"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="p-4 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room Reference Name *</label>
                <input 
                  type="text"
                  required
                  value={tempRoomName}
                  onChange={(e) => setTempRoomName(e.target.value)}
                  placeholder="E.g., Balcony Middle Bedroom, Master A"
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Rent Price (RM) *</label>
                  <input 
                    type="number"
                    required
                    value={tempRoomPrice}
                    onChange={(e) => setTempRoomPrice(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Security Deposits Required</label>
                  <input 
                    type="text"
                    value={tempRoomDeposit}
                    onChange={(e) => setTempRoomDeposit(e.target.value)}
                    placeholder="E.g., 2.5 Months"
                    className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Size (Sqft)</label>
                  <input 
                    type="text"
                    value={tempRoomSize}
                    onChange={(e) => setTempRoomSize(e.target.value)}
                    placeholder="E.g., 140 sqft"
                    className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Decision Status</label>
                  <select
                    value={tempRoomVerdict}
                    onChange={(e) => setTempRoomVerdict(e.target.value as RoomVerdict)}
                    className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs text-slate-700 outline-hidden font-semibold"
                  >
                    <option value="love_it">🔥 Love It</option>
                    <option value="maybe">⚖️ Maybe</option>
                    <option value="skip">✖ Skip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Opening General Comments</label>
                <textarea 
                  value={tempRoomNotes}
                  onChange={(e) => setTempRoomNotes(e.target.value)}
                  placeholder="Type initial reactions (e.g. Needs cleaning but furniture is high quality)..."
                  rows={2}
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs focus:outline-hidden focus:border-emerald-500 font-medium text-slate-800 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => setIsNewRoomModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Confirm Room Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW DOSSIER PORTAL */}
      {isDossierOpen && activeProperty && (
        <ExportModal
          property={activeProperty}
          rooms={rooms}
          onClose={() => setIsDossierOpen(false)}
        />
      )}

      {/* FULLSCREEN POPUP ZOOM MODALS */}
      {fullscreenPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 p-4 flex flex-col items-center justify-center cursor-pointer font-sans"
          onClick={() => setFullscreenPhoto(null)}
        >
          <button 
            type="button"
            onClick={() => setFullscreenPhoto(null)}
            className="absolute top-4 right-4 bg-white/20 p-2.5 rounded-full text-white hover:bg-white/35"
          >
            <X size={20} />
          </button>
          
          <div className="max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white p-2 border border-slate-200 shadow-2xl">
            <img 
              src={fullscreenPhoto} 
              alt="Zoomed Evidence View" 
              className="max-h-[75vh] object-contain rounded-xl w-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-white/60 text-xs mt-3">Click anywhere to close zoom widget</span>
        </div>
      )}

    </div>
  );
}
