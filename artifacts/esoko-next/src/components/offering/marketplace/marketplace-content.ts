import { NEXT_BASE_PATH } from '../../../lib/site-links';
import photos from './marketplace-photos.json';

export const MARKETPLACE_TITLE = 'Empowering agricultural trade with innovative solutions';
export const MARKETPLACE_DESCRIPTION = 'Buy and sell agricultural products directly, with verified suppliers across the value chain.';
export const MARKETPLACE_PHOTOS = photos.map(photo => ({ ...photo, src: NEXT_BASE_PATH + photo.src }));
export type MarketplacePhotoData = typeof MARKETPLACE_PHOTOS[number];
export function marketplacePhoto(id: string): MarketplacePhotoData {
  const photo = MARKETPLACE_PHOTOS.find(photo => photo.id === id);
  if (!photo) throw new Error('Unknown Marketplace photograph: ' + id);
  return photo;
}
export const MARKETPLACE_GALLERY = ['104114', '114744', '115613', '113358', '115630', '120906'].map(marketplacePhoto);
