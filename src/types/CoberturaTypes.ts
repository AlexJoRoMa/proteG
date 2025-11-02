import { Asset, Entry, EntrySkeletonType } from "contentful";
import { ReactNode } from "react";

export type CoberturaID = {
    id: string;
}

interface MediaEntryFields {
  image?: Asset;
}

interface MediaEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'media';
  fields: MediaEntryFields;
}

export interface StepTabEntryFields extends EntrySkeletonType{
  image?: Entry<MediaEntrySkeleton>;
  entryTitle?: string;
  entryBody?: string;
  textBoton1?: string;
  linkBoton1?: string;
}

export interface StepTabEntrySkeleton extends EntrySkeletonType{
  contentTypeId: 'stepTabEntry';
  fields: StepTabEntryFields;
}

export interface GeocodeType {
  results: AddressType[],
}

export interface AddressType {
  formatted_address: string,
  address_components: [{
      long_name: string,
      short_name: string,
      types: string[]
  }]
}


export type ProviderProps = {
  children: ReactNode,
  addressSelected: boolean,
  selectedPlace: google.maps.places.PlaceResult | null,
  setSelectedPlace: google.maps.places.PlaceResult | null,
  markerPosition: google.maps.LatLng | google.maps.LatLngLiteral,
  setMarkerPosition: google.maps.LatLng | google.maps.LatLngLiteral,
  postalCode: string,
  setPostalCode: string,
  street: string,
  setStreet: string,
  streetNumber: string,
  setStreetNumber: string,
  aptNumber: string,
  setAptNumber: string,
  neighborhood: string,
  setNeighborhood: string,
  locality: string,
  setLocality: string,
  name: string,
  setName: string,
  phone: string,
  setPhone: string,
  lat: number,
  setLat: number,
  lng: number,
  setLng: number,
  formattedAddress: string,
  setFormattedAddress: string
}
export type DataFields = {
  addressSelected: boolean,
  setAddress: React.Dispatch<React.SetStateAction<boolean>>
  selectedPlace: google.maps.places.PlaceResult | null,
  setSelectedPlace: React.Dispatch<React.SetStateAction<google.maps.places.PlaceResult | null>>,
  markerPosition: google.maps.LatLng | google.maps.LatLngLiteral,
  setMarkerPosition: React.Dispatch<React.SetStateAction<google.maps.LatLng | google.maps.LatLngLiteral>>,
  postalCode: string,
  setPostalCode: React.Dispatch<React.SetStateAction<string>>
  street: string,
  setStreet: React.Dispatch<React.SetStateAction<string>>
  streetNumber: string,
  setStreetNumber: React.Dispatch<React.SetStateAction<string>>
  aptNumber: string,
  setAptNumber: React.Dispatch<React.SetStateAction<string>>
  neighborhood: string,
  setNeighborhood: React.Dispatch<React.SetStateAction<string>>
  locality: string,
  setLocality: React.Dispatch<React.SetStateAction<string>>
  state: string,
  setState: React.Dispatch<React.SetStateAction<string>>
  name: string,
  setName: React.Dispatch<React.SetStateAction<string>>
  phone: string,
  setPhone: React.Dispatch<React.SetStateAction<string>>
  lat: number,
  setLat: React.Dispatch<React.SetStateAction<number>>,
  lng: number,
  setLng: React.Dispatch<React.SetStateAction<number>>,
}