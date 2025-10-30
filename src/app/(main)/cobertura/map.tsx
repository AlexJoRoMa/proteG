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
   } = useContent();

  const HandleMapClick = (ev: MapMouseEvent) => {
      setMarkerPosition(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
      if (map){
          map.panTo(ev.detail?.latLng as google.maps.LatLng | google.maps.LatLngLiteral);
      }
      const data = geocodeApi(ev.detail?.latLng?.lat as number, ev.detail?.latLng?.lng as number);
      data.then((result) => {
        mapAddressFields(result);
      });
      setAddress(true);
    }

    function mapAddressFields (data: GeocodeType) {
      if (data && data.results) data.results[0].address_components.map(item => {
          switch (item.types[0]) {
              case 'postal_code':
                  setPostalCode(item.long_name)
                  break;
              case 'route':
                  setStreet(item.long_name)
                  break;
              case 'street_number':
                  setStreetNumber(item.long_name)
                  break;
              case 'neighborhood':
                  setNeighborhood(item.long_name)
                  break;
              case 'locality':
                  setLocality(item.long_name)
                  break;
              default:
                  break;
          }
  
      })
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