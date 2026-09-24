import { getStorageItem, setStorageItem } from '../utils/storage';

/** Uygulama genelinde tek yıldız/puan sayacı — hub başlığında ve sınavda gösterilir. */
const STARS_KEY = 'ogrenme_stars_total';

export const getStars = (): number => getStorageItem<number>(STARS_KEY, 0);

export const addStars = (amount: number): number => {
  const total = getStars() + amount;
  setStorageItem(STARS_KEY, total);
  return total;
};
