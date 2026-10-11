/** Longest edge sent to the model. Larger photos cost more and add nothing for food estimates. */
const MAX_EDGE_PX = 1568;
const JPEG_QUALITY = 0.85;

export interface EncodedImage {
  mediaType: 'image/jpeg';
  base64: string;
}

/** Downscales a phone photo and re-encodes it as base64 JPEG, ready for the Messages API. */
export async function encodePhoto(file: Blob): Promise<EncodedImage> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context unavailable');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  return { mediaType: 'image/jpeg', base64: dataUrl.slice(dataUrl.indexOf(',') + 1) };
}
