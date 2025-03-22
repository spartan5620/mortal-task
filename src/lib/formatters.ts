
/**
 * Format price in Rupees
 */
export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};
