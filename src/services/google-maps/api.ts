import { GeocodeType } from "@/types/CoberturaTypes";

export const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

async function geocodeApi(lat: number, lng: number): Promise<GeocodeType> {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapsKey}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: GeocodeType = await response.json();
    return data
};

export default geocodeApi;