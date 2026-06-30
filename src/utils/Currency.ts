
export function FormatCurrency(price: number | string) {
  const formatPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(price));

  return formatPrice;
}

export function FormatPromotions(price: number | string) {
  const formatPrice = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(price));

  return formatPrice;
}