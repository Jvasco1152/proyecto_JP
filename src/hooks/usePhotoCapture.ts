import { get, keys, del } from 'idb-keyval';

export async function getPhotoBase64(photoId: string): Promise<string | null> {
  try {
    return (await get<string>(photoId)) || null;
  } catch {
    return null;
  }
}

export async function getAllPhotos(photoIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const id of photoIds) {
    const data = await getPhotoBase64(id);
    if (data) result[id] = data;
  }
  return result;
}

export async function clearAllPhotos(): Promise<void> {
  const allKeys = await keys();
  for (const key of allKeys) {
    if (typeof key === 'string' && key.startsWith('photo_')) {
      await del(key);
    }
  }
}
