/**
 * Currency and ERP Number Formatting Utilities for Kenyan Shilling (Ksh / KES)
 */

export function formatKsh(amount: number, options?: { showDecimals?: boolean; compact?: boolean }): string {
  const { showDecimals = false, compact = false } = options || {};
  
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Ksh 0';
  }

  if (compact && Math.abs(amount) >= 1_000_000) {
    return `Ksh ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && Math.abs(amount) >= 1_000) {
    return `Ksh ${(amount / 1_000).toFixed(1)}K`;
  }

  const formatted = amount.toLocaleString('en-KE', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return `Ksh ${formatted}`;
}

export function formatNumber(value: number): string {
  return (value || 0).toLocaleString('en-KE');
}

export function calculateVat(subtotal: number, vatRate = 0.16) {
  const vatAmount = subtotal * vatRate;
  const grandTotal = subtotal + vatAmount;
  return {
    vatAmount: Math.round(vatAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}
