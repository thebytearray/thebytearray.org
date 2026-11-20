// Google Play prices for the paid apps. Play sets a different price in each
// country, so the site lists several instead of one. Copied from each app's Play
// listing (the schema.org Offer on
// https://play.google.com/store/apps/details?id=<package>&hl=en&gl=<country>);
// update them here when a price changes on Play.
import type { App, AppSlug } from '../data/apps';

export interface Price {
  /** ISO 3166-1 country code the price is for. */
  country: string;
  amount: string;
  currency: string;
}

const prices: Partial<Record<AppSlug, Price[]>> = {
  // Checked on 19 November 2026.
  'convertit-pro': [
    { country: 'US', amount: '5.99', currency: 'USD' },
    { country: 'GB', amount: '4.99', currency: 'GBP' },
    { country: 'DE', amount: '5.99', currency: 'EUR' },
    { country: 'IN', amount: '690', currency: 'INR' },
  ],
};

/** The app's Play prices; empty for free apps. */
export const getPrices = (app: App): Price[] => (app.paid && prices[app.slug]) || [];

/** A price as shoppers see it, for example "$5.99" or "₹690". Whole amounts drop
 * the ".00" so every price reads in one format. */
export const formatPrice = ({ amount, currency }: Price) => {
  const value = Number(amount);
  const digits = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};
