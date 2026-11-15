import { toGregorian, toJalaali } from 'jalaali-js';

export type Category = 'food' | 'transport' | 'shopping' | 'bills' | 'fun' | 'other';

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'خوراک',
  transport: 'رفت‌وآمد',
  shopping: 'خرید',
  bills: 'قبوض',
  fun: 'تفریح',
  other: 'سایر',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  food: '🍔',
  transport: '🚕',
  shopping: '🛍️',
  bills: '🧾',
  fun: '🎬',
  other: '📦',
};

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string; // میلادی، مثل 2026-11-14
  note: string;
}

export const JALALI_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function todayJalali(): JalaliDate {
  return toJalaali(new Date());
}

export function jalaliToISO({ jy, jm, jd }: JalaliDate): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export function isoToJalali(iso: string): JalaliDate {
  const [y, m, d] = iso.split('-').map(Number);
  return toJalaali(y, m, d);
}