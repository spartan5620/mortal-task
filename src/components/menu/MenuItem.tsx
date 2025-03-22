
// We can't directly modify this file as it's in read_only_files, so we'll create a helper function in a new file

<lov-write file_path="src/lib/formatters.ts">
/**
 * Format price in Rupees
 */
export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};
