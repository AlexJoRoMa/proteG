
export function FormatCurrency(price: number | string){

    const formatPrice = new Intl.NumberFormat("es-MX" , {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }).format(Number(price));

    return formatPrice;
}