import React, { useState, ChangeEvent } from 'react';
import { Camera, Upload, Trash2, Eye, Star, Check } from 'lucide-react';
import { RoomAspect } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface RoomAspectCardProps {
  key?: React.Key;
  aspect: RoomAspect;
  onUpdate: (updates: Partial<RoomAspect>) => void;
  setFullscreenPhoto: (photo: string | null) => void;
}

export default function RoomAspectCard({ aspect, onUpdate, setFullscreenPhoto }: RoomAspectCardProps) {
  const [isCompilersActive, setIsCompilersActive] = useState(false);
  
  const handleRating = (ratingValue: number) => {
    onUpdate({ rating: ratingValue });
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ notes: e.target.value });
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompilersActive(true);
    try {
      // Compress to ~30KB to save localStorage memory
      const base64 = await compressImage(file, 640, 0.6);
      onUpdate({
        photo: base64,
        photoDate: new Date().toLocaleDateString()
      });
    } catch (err) {
      console.error("Critical image compress error:", err);
      alert("Could not process image file. Please try another copy.");
    } finally {
      setIsCompilersActive(false);
    }
  };

  const triggerCameraInput = (id: string) => {
    const element = document.getElementById(`camera-uploader-${id}`) as HTMLInputElement;
    if (element) {
      element.click();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-4 transition hover:shadow-sm">
      
      {/* Aspect Title Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-0.5">
          <h4 className="font-semibold text-slate-800 text-sm md:text-base leading-tight font-sans">
            {aspect.name}
          </h4>
          <p className="text-xs text-slate-400 font-sans leading-normal">
            {aspect.description}
          </p>
        </div>
      </div>

      {/* NEW 1-5 STAR RATING INTERACTION */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 font-sans">Rating:</span>
        <div className="flex items-center gap-1.5" id={`star-rating-pool-${aspect.id}`}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= aspect.rating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className={`p-1.5 rounded-full transition-transform active:scale-125 cursor-pointer ${
                  isActive ? 'text-amber-400' : 'text-slate-200 hover:text-slate-300'
                }`}
                title={`Rate ${star} Stars`}
              >
                <Star size={20} className="fill-current stroke-[2px]" />
              </button>
            );
          })}
        </div>
        <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md border ${
          aspect.rating >= 4 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : aspect.rating >= 3 
            ? 'bg-slate-50 text-slate-600 border-slate-200'
            : aspect.rating > 0
            ? 'bg-rose-50 text-rose-700 border-rose-100'
            : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {aspect.rating > 0 ? `${aspect.rating} / 5 Stars` : 'Unrated'}
        </span>
      </div>

      {/* Notes Field */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 focus-within:bg-white focus-within:border-slate-200 transition-all">
        <textarea
          value={aspect.notes}
          onChange={handleTextChange}
          placeholder={`Enter evaluation observations for ${aspect.name.toLowerCase()} here...`}
          rows={2}
          className="w-full text-xs bg-transparent border-0 outline-hidden focus:ring-0 text-slate-700 font-sans resize-none placeholder:text-slate-400"
        />
      </div>

      {/* Photo Capture Area */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-50">
        
        {aspect.photo ? (
          <div className="flex items-center gap-2.5 bg-slate-50/80 rounded-xl p-1.5 pr-3 border border-slate-100 w-full justify-between">
            <div className="flex items-center gap-2">
              <div 
                onClick={() => setFullscreenPhoto(aspect.photo || null)}
                className="relative w-12 h-12 rounded-lg bg-slate-200 overflow-hidden cursor-zoom-in group border border-slate-100 shrink-0"
              >
                <img 
                  src={aspect.photo} 
                  alt="Inspection Capture" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Eye size={12} className="text-white" />
                </div>
              </div>

              <div className="font-sans">
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                  <Check size={10} className="text-emerald-500" /> Evidence Added
                </span>
                <span className="text-[9px] text-slate-400 block">{aspect.photoDate}</span>
              </div>
            </div>

            <button
              onClick={() => onUpdate({ photo: undefined, photoDate: undefined })}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
              title="Remove photography confirmation"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 w-full">
            {/* Camera / Upload trigger */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Forces native iOS camera popup!
              id={`camera-uploader-${aspect.id}`}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <button
              type="button"
              disabled={isCompilersActive}
              onClick={() => triggerCameraInput(aspect.id)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition duration-150 cursor-pointer disabled:opacity-50"
            >
              <Camera size={14} />
              <span>{isCompilersActive ? 'Compressing...' : 'Take Photo (Camera)'}</span>
            </button>
            
            <button
              type="button"
              disabled={isCompilersActive}
              onClick={() => triggerCameraInput(aspect.id)}
              className="px-3.5 py-2.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition duration-150 cursor-pointer disabled:opacity-50"
              title="Select local photo roll"
            >
              <Upload size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
