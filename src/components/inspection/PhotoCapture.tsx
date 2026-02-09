import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { get, set, del } from 'idb-keyval';
import { compressImage, blobToBase64 } from '../../services/imageCompressor';

const MAX_PHOTOS = 3;

interface PhotoCaptureProps {
  itemId: string;
  photoIds: string[];
  onPhotosChange: (photoIds: string[]) => void;
}

export default function PhotoCapture({ itemId, photoIds, onPhotosChange }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Load thumbnails from IndexedDB
  useEffect(() => {
    async function loadThumbnails() {
      const thumbs: Record<string, string> = {};
      for (const id of photoIds) {
        const data = await get<string>(id);
        if (data) thumbs[id] = data;
      }
      setThumbnails(thumbs);
    }
    if (photoIds.length > 0) loadThumbnails();
  }, [photoIds]);

  async function handleCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const remaining = MAX_PHOTOS - photoIds.length;
      const filesToProcess = Array.from(files).slice(0, remaining);
      const newIds: string[] = [];
      const newThumbs: Record<string, string> = {};

      for (const file of filesToProcess) {
        const compressed = await compressImage(file);
        const base64 = await blobToBase64(compressed);
        const photoId = `photo_${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        await set(photoId, base64);
        newIds.push(photoId);
        newThumbs[photoId] = base64;
      }

      const updatedIds = [...photoIds, ...newIds];
      setThumbnails(prev => ({ ...prev, ...newThumbs }));
      onPhotosChange(updatedIds);
    } catch (err) {
      console.error('Error al procesar foto:', err);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove(photoId: string) {
    await del(photoId);
    const updatedIds = photoIds.filter(id => id !== photoId);
    setThumbnails(prev => {
      const next = { ...prev };
      delete next[photoId];
      return next;
    });
    onPhotosChange(updatedIds);
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Thumbnails */}
        {photoIds.map(id => (
          <div key={id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            {thumbnails[id] ? (
              <img src={thumbnails[id]} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-slate-300" />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemove(id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Capture button */}
        {photoIds.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span className="text-[9px]">Foto</span>
              </>
            )}
          </button>
        )}
      </div>

      {photoIds.length > 0 && (
        <p className="text-xs text-slate-400 mt-1">
          {photoIds.length}/{MAX_PHOTOS} fotos
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        className="hidden"
      />
    </div>
  );
}
