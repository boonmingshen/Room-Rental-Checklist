import { useState } from 'react';
import { X, Printer, Download, Sparkles, Star, ClipboardList, PenTool, CheckCircle2 } from 'lucide-react';
import { Property, Room, RoomAspect } from '../types';

interface ExportModalProps {
  property: Property;
  rooms: Room[];
  onClose: () => void;
}

export default function ExportModal({ property, rooms, onClose }: ExportModalProps) {
  const [remarks, setRemarks] = useState(property.overallNotes || '');
  const [userName, setUserName] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const getAverageStars = (room: Room) => {
    const ratedAspects = room.aspects.filter(a => a.rating > 0);
    if (ratedAspects.length === 0) return 0;
    const sum = ratedAspects.reduce((acc, a) => acc + a.rating, 0);
    return Number((sum / ratedAspects.length).toFixed(1));
  };

  const activeRooms = rooms.filter(r => r.propertyId === property.id);

  const handlePrint = () => {
    window.print();
  };

  const handleJSONExport = () => {
    const backupData = {
      property,
      rooms: activeRooms,
      exportedAt: new Date().toISOString(),
      app: 'Room rental checklist'
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `RoomScout-Report-${property.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:absolute print:inset-0 print:bg-white print:backdrop-blur-none">
      
      {/* Absolute PDF print style patch */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          .pdf-panel, .pdf-panel * {
            visibility: visible;
          }
          .pdf-panel {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border border-slate-100 print:h-auto print:border-none print:shadow-none">
        
        {/* Top bar controls */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 no-print bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-emerald-600" size={18} />
            <span className="font-serif font-bold text-slate-800 text-sm md:text-base">Save Audit Dossier as PDF</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleJSONExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              title="Download backup file"
            >
              <Download size={13} className="text-emerald-600" />
              <span>Export JSON Backup</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form area + printable page template */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:p-0">
          
          {/* Input Details Block - No Print */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-4.5 no-print">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
              <PenTool size={13} className="text-amber-500" /> Document Configuration Remarks
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 font-sans">Scouted By (Your Name)</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder="E.g., Tan Boon Ming" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500 font-sans"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 font-sans">Shared With / Recipient (Optional)</label>
                <input 
                  type="text" 
                  value={recipientName} 
                  onChange={(e) => setRecipientName(e.target.value)} 
                  placeholder="E.g., Parents, Roommates, Renting Agent" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1 font-sans">Overall Evaluation Remarks / Observations</label>
              <textarea 
                value={remarks} 
                onChange={(e) => setRemarks(e.target.value)} 
                placeholder="Type general summaries of Pacific Stars facilities (e.g. Near LRT, tight security on parking, beautiful pool but gym is small)."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500 font-sans"
              />
            </div>
          </div>

          {/* PDF PANEL STARTS HERE */}
          <div className="pdf-panel p-8 bg-white border border-slate-200 rounded-2xl space-y-6 print:border-none print:p-0 font-sans">
            
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-3 py-1 mb-2.5 inline-block">
                  Property Rental Scout Report
                </span>
                <h1 className="text-2xl font-serif font-black text-slate-900 tracking-tight leading-tight">
                  {property.name}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Location: <span className="font-bold text-slate-800">{property.location || 'Malaysia'}</span>
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-500">
                <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wider">Report Released On</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{new Date().toLocaleDateString()}</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">✓ Active Comparison Dossier</span>
              </div>
            </div>

            {/* General Metadata metadata cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-sans">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Inspector Agent / Tenant</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{userName || 'Tan Boon Ming'}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Target Audience / Roommates</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{recipientName || 'Parents / Leasing Agent'}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Inspected Rooms Checked</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{activeRooms.length} Rooms Tracked</span>
              </div>
            </div>

            {/* Overall Verdict Summaries text */}
            {remarks && (
              <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-slate-800 uppercase text-[9px] tracking-widest">General Auditor Comments</h4>
                <p className="text-slate-600 bg-white border border-slate-100 p-3 rounded-lg leading-relaxed italic font-sans">
                  "{remarks}"
                </p>
              </div>
            )}

            {/* Rooms side-by-side brief scorecard */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-1.5">
                Room Valuation Summary Matrix
              </h3>

              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {activeRooms.map(room => {
                  const avg = getAverageStars(room);
                  return (
                    <div key={room.id} className="p-4 bg-white hover:bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{room.name}</h4>
                        <div className="flex gap-4 text-[10px] text-slate-500 mt-0.5">
                          <span>Deposit: <strong className="text-slate-700">{room.depositRequired || '1 Month'}</strong></span>
                          {room.sizeSqft && <span>Size: <strong className="text-slate-700">{room.sizeSqft}</strong></span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block uppercase font-bold">Monthly Rental</span>
                          <span className="text-xs font-black text-emerald-600">RM {room.rentPrice}</span>
                        </div>

                        <div className="bg-amber-50 text-amber-800 font-bold px-2 py-1 rounded-lg border border-amber-100 flex items-center gap-1 shrink-0 text-[10px]">
                          <Star size={12} className="fill-current text-amber-400" />
                          <span>{avg > 0 ? `${avg} / 5` : 'No checks'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete listing aspect checkmarks room-by-room */}
            <div className="space-y-6 pt-2">
              <h3 className="font-serif font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-1.5">
                Room-by-Room Inspections & Photo Proofs
              </h3>

              {activeRooms.map((room, idx) => {
                const avg = getAverageStars(room);
                return (
                  <div key={room.id} className={`space-y-3 p-4 bg-slate-50/20 border border-slate-100 rounded-2xl ${idx > 0 ? 'page-break' : ''}`}>
                    <div className="flex justify-between items-center bg-slate-100/50 p-3 rounded-xl border border-slate-200/50">
                      <div>
                        <h4 className="font-serif font-extrabold text-slate-900 text-sm md:text-base">
                          {idx + 1}. {room.name}
                        </h4>
                        {room.generalNotes && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5">"{room.generalNotes}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-black text-emerald-700 block">RM {room.rentPrice} / mo</span>
                        <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 font-bold">
                          ★ {avg > 0 ? `${avg} Stars` : 'Unrated'}
                        </span>
                      </div>
                    </div>

                    {/* Aspects details table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2.5">
                      {room.aspects.map(aspect => {
                        if (aspect.rating === 0 && !aspect.notes) return null;
                        return (
                          <div key={aspect.id} className="bg-white border border-slate-100 rounded-xl p-3 flex gap-3 text-xs justify-between">
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-slate-800 block leading-snug">{aspect.name}</span>
                              
                              <div className="flex items-center gap-1.5 my-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} size={10} className={`${star <= aspect.rating ? 'fill-current text-amber-400' : 'text-slate-200'}`} />
                                ))}
                              </div>

                              {aspect.notes && (
                                <p className="text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg mt-1 italic block leading-relaxed max-w-xs truncate-none font-sans">
                                  {aspect.notes}
                                </p>
                              )}
                            </div>

                            {/* Aspect Photo */}
                            {aspect.photo && (
                              <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-10 transition overflow-hidden shadow-xs shrink-0 self-center">
                                <img src={aspect.photo} alt={aspect.name} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Signature row validation block */}
            <div className="grid grid-cols-2 gap-8 border-t-2 border-slate-100 pt-6 mt-12 page-break-inside-avoid text-xs font-sans">
              <div className="space-y-4">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Audited & Prepared By</span>
                <div className="border-b border-slate-300 h-10 flex items-end pb-1 text-slate-800 font-bold font-serif text-sm">
                  {userName || 'Tan Boon Ming'}
                </div>
                <span className="text-[9px] text-slate-400 block">Scout Signature / Date</span>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Witnessed / Received By</span>
                <div className="border-b border-slate-300 h-10 flex items-end pb-1 text-slate-800 font-bold font-serif text-sm">
                  {recipientName || '______________________'}
                </div>
                <span className="text-[9px] text-slate-400 block">Witness Signature / Date</span>
              </div>
            </div>

            {/* Print Area Footer */}
            <div className="border-t border-slate-100 pt-4 text-center text-[10px] text-slate-400 font-sans">
              Generated via Room Rental Checklist Tracker inside Malaysia. Localized sandboxed browser caching.
            </div>

          </div>
          {/* PDF PANEL ENDS HERE */}

        </div>
      </div>
    </div>
  );
}
