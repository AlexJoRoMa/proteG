import { useContent } from '@/components/providers/CoberturaProvider';
import geocodeApi from '@/services/google-maps/api';
import {
    AdvancedMarker,
    Map,
    useMap,
    useAdvancedMarkerRef,
    MapMouseEvent,
  } from '@vis.gl/react-google-maps';
import { GeocodeType } from '@/types/CoberturaTypes';

export default function IzziMap(){
  const map = useMap();
  const [markerRef] = useAdvancedMarkerRef();
  const { setAddress, markerPosition, setMarkerPosition,
    setPostalCode,
    setStreet,
    setStreetNumber,
    setNeighborhood,
    setLocality,
    setState,
    setLat,
    setLng,
    setMode
   } = useContent();

  const HandleMapClick = (ev: MapMouseEvent) => {
      setMarkerPosition(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
      setLat(ev.detail?.latLng?.lat as number);
      setLng(ev.detail?.latLng?.lng as number);
      if (map){
          map.panTo(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
      }
      const data = geocodeApi(ev.detail?.latLng?.lat as number, ev.detail?.latLng?.lng as number);
      data.then((result) => {
        mapAddressFields(result);
      });
      setAddress(true);
      setMode('postalCode');
    }

function mapAddressFields(data: GeocodeType) {
    const components = data?.results?.[0]?.address_components ?? [];
  
    for (const item of components) {
      const value = item.long_name;
  
      for (const type of item.types) {
        switch (type) {
          case 'postal_code':
            setPostalCode(value);
            break;
          case 'route':
            setStreet(value);
            break;
          case 'street_number':
            setStreetNumber(value);
            break;
          case 'neighborhood':
          case 'sublocality':
          case 'sublocality_level_1':
            setNeighborhood(value);
            break;
          case 'locality':
            setLocality(value);
            break;
          case 'administrative_area_level_1':
            setState(value);
            break;
          default:
            break;
        }
      }
    }
  }

  return (
      <>
      <Map
          mapId={'bf51a910020fa25a'}
          style={{height: '400px'}}
          defaultCenter={{lat: 19.4311231, lng: -99.1777154}}
          defaultZoom={15}
          disableDefaultUI={true}
          onClick={HandleMapClick}
      >
      <AdvancedMarker ref={markerRef} position={markerPosition} />
      </Map>
      </>
  );
}