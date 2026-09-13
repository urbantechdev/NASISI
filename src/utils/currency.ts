export function formatKsh(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Ksh 0';
  return `Ksh ${Math.round(amount).toLocaleString('en-KE')}`;
}
