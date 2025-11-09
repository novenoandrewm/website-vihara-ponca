export function formatCurrency(
  value: number,
  locale = 'id-ID',
  currency = 'IDR',
  maxFraction = 0
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: maxFraction,
  }).format(value)
}
