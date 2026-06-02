import { useState, useMemo } from 'react';
import { Star, ShieldAlert, Check, AlertTriangle, Eye, ArrowUpDown, DollarSign, Sparkles } from 'lucide-react';
import { Property, Room, RoomAspect, ROOM_ASPECT_TEMPLATES } from '../types';

interface CompareViewProps {
  properties: Property[];
  rooms: Room[];
  selectedPropertyId: string;
}

export default function CompareView({ properties, rooms, selectedPropertyId }: CompareViewProps) {
  const [fullscreenPhoto, setFullscreenPhoto] = useState<string | null>(null);

  // Filter rooms of the current active property
  const activeRooms = useMemo(() => {
    return rooms.filter(r => r.propertyId === selectedPropertyId);
  }, [rooms, selectedPropertyId]);

  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId);
  }, [properties, selectedPropertyId]);

  // Calculate rating average helper
  const getAverageStars = (room: Room) => {
    const ratedAspects = room.aspects.filter(a => a.rating > 0);
    if (ratedAspects.length === 0) return 0;
    const sum = ratedAspects.reduce((acc, a) => acc + a.rating, 0);
    return Number((sum / ratedAspects.length).toFixed(1));
  };

  const getVerdictBadge = (verdict: Room['verdict']) => {
    switch (verdict) {
      case 'love_it':
        return { label: '🔥 Love It', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'maybe':
        return { label: '⚖️ Maybe', class: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'skip':
        return { label: '✖ Skip', class: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Unset', class: 'bg-slate-50 text-slate-500 border-slate-200' };
    }
  };

  if (activeRooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center max-w-md mx-auto my-6 space-y-4">
        <div className="p-3 bg-amber-50 text-amber-500 rounded-full inline-block">
          <ShieldAlert size={28} />
        </div>
        <h3 className="font-serif font-bold text-slate-800 text-base">No Rooms Stored For Quick Audit</h3>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          To display side-by-side matrix comparisons, please add at least one room under <strong>{activeProperty?.name || "the active house"}</strong> in the Rooms tab first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Property comparison header */}
      <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 font-sans">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles size={15} className="text-amber-500" />
          Scout Matrix: {activeProperty?.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Scroll horizontally to compare all inspected rooms from your mobile web preview or screen.
        </p>
      </div>

      {/* Swipeable responsive table wrapper */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-xs">
        <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="w-48 p-4 text-xs font-bold uppercase text-slate-400 tracking-wider font-sans">Spec Factor</th>
              {activeRooms.map(room => (
                <th key={room.id} className="p-4 font-sans text-left">
                  <span className="text-sm font-bold text-slate-800 block truncate">{room.name}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">RM {room.rentPrice} / mo</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-sans text-slate-600">
            {/* Rent & Deposit ROW */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/20">Monthly Rent (RM)</td>
              {activeRooms.map(room => (
                <td key={room.id} className="p-4 font-bold text-slate-800 text-sm">
                  RM {room.rentPrice}
                </td>
              ))}
            </tr>

            {/* Deposit Required ROW */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/20">Deposits Structure</td>
              {activeRooms.map(room => (
                <td key={room.id} className="p-4 font-medium text-slate-700">
                  {room.depositRequired || 'No Deposit Stated'}
                </td>
              ))}
            </tr>

            {/* Overall Score ROW */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/20">Overall Score (Stars)</td>
              {activeRooms.map(room => {
                const avg = getAverageStars(room);
                return (
                  <td key={room.id} className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-amber-400">
                        <Star size={14} className="fill-current" />
                      </div>
                      <span className="font-bold text-slate-800 text-sm">
                        {avg > 0 ? `${avg} / 5` : 'No reviews'}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Verdict Status ROW */}
            <tr>
              <td className="p-4 font-bold text-slate-500 bg-slate-50/20">Decision Status</td>
              {activeRooms.map(room => {
                const badge = getVerdictBadge(room.verdict);
                return (
                  <td key={room.id} className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase ${badge.class}`}>
                      {badge.label}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Dynamic Room Aspects rows */}
            {ROOM_ASPECT_TEMPLATES.map(aspectTpl => (
              <tr key={aspectTpl.id}>
                <td className="p-4 font-bold text-slate-500 bg-slate-50/20">
                  <span className="block font-medium text-slate-700">{aspectTpl.name}</span>
                </td>
                {activeRooms.map(room => {
                  const aspect = room.aspects.find(a => a.id === aspectTpl.id) || { rating: 0, notes: '', id: aspectTpl.id, name: aspectTpl.name, description: '' };
                  return (
                    <td key={room.id} className="p-4 space-y-2">
                      {/* Rating stars inside cell */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={11} 
                            className={`${star <= aspect.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>

                      {/* Notes snippet */}
                      {aspect.notes && (
                        <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg leading-relaxed italic max-w-xs break-words">
                          "{aspect.notes}"
                        </p>
                      )}

                      {/* Photo thumbnail */}
                      {aspect.photo && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            onClick={() => setFullscreenPhoto(aspect.photo || null)}
                            className="relative w-8 h-8 rounded border border-slate-200 overflow-hidden cursor-zoom-in group shrink-0"
                          >
                            <img src={aspect.photo} alt="aspect-evidence" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                              <Eye size={10} className="text-white" />
                            </div>
                          </button>
                          <span className="text-[9px] text-slate-400 font-medium">Pic Attached</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fullscreen Photo Modal */}
      {fullscreenPhoto && (
        <div 
          className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 cursor-pointer font-sans"
          onClick={() => setFullscreenPhoto(null)}
        >
          <div className="max-w-xl max-h-[80vh] overflow-hidden rounded-2xl bg-white p-2 border border-slate-100 shadow-2xl relative">
            <img 
              src={fullscreenPhoto} 
              alt="Zoomed Evidence View" 
              className="max-h-[75vh] object-contain rounded-xl w-full"
            />
            <span className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] px-2.5 py-1 rounded-full">
              Click anywhere to dismiss zoom
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
