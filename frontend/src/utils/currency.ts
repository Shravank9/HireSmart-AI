/**
 * HireSmart AI — Indian Rupee (INR / ₹) Currency Utilities
 */

export const formatSalaryInr = (minSalary?: number, maxSalary?: number): string => {
  if (!minSalary && !maxSalary) return '₹ Competitive';
  const min = minSalary || 0;
  const max = maxSalary || 0;

  // Format in Lakhs if value >= 100,000 (e.g., 1200000 -> 12L)
  if (min >= 100000 || max >= 100000) {
    const minL = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
    const maxL = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
    return `₹${minL}L - ₹${maxL}L / yr`;
  }

  // Format in thousands if between 1,000 and 99,999
  if (min >= 1000 || max >= 1000) {
    const minK = (min / 1000).toFixed(0);
    const maxK = (max / 1000).toFixed(0);
    return `₹${minK}k - ₹${maxK}k / mo`;
  }

  return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
};
