export const formatKsh = (amount: number): string => {
  return `KSh ${Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const parseKsh = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};
