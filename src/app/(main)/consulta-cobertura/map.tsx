import { useContent } from '@/components/providers/CoberturaProvider';
import geocodeApi from '@/services/google-maps/api';
import {
    AdvancedMarker,
    ControlPosition,
    Map,
    useMap,
    useAdvancedMarkerRef,
    MapMouseEvent,
  } from '@vis.gl/react-google-maps';
import { GeocodeType } from '@/types/CoberturaTypes';
import { useIzziContent } from '@/components/providers/IzziProvider';

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

   const { setAddressFielSelected, setStreetDireccion, setColoniaError } = useIzziContent();
   const DEFAULT_CENTER = { lat: 19.4326, lng: -99.1332 };
   const DEFAULT_ZOOM = 15;

  const updateLocationData = async (lat: number, lng: number) => {
    const nextPosition = {lat, lng};

    setMarkerPosition(nextPosition);
    setLat(lat);
    setLng(lng);

    if (map) {
      map.panTo(nextPosition);
    }

    const result = await geocodeApi(lat, lng);
    mapAddressFields(result);
    setAddress(true);
    setMode('postalCode');
  };

  const HandleMapClick = (ev: MapMouseEvent) => {
      const lat = ev.detail?.latLng?.lat;
      const lng = ev.detail?.latLng?.lng;

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return;
      }

      updateLocationData(lat, lng);
      setAddressFielSelected(true)
    }

  const handleMarkerDragEnd = (ev: google.maps.MapMouseEvent) => {
      const lat = ev.latLng?.lat();
      const lng = ev.latLng?.lng();

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return;
      }

      updateLocationData(lat, lng);
    };

function mapAddressFields(data: GeocodeType) {
    const components = data?.results?.[0]?.address_components ?? [];
    let coloniaExist = false;
    
    //Se busca si existe un array con administrative_area_level_3
    const getAreaLevel = data?.results?.find( result => 
      result.address_components.some( component => 
        component.types.includes('administrative_area_level_3')
      )
    );

    const typeAreaLevel = getAreaLevel?.address_components ?? [];

    const allComponents = [...components, ...typeAreaLevel]
  
    let valueLocality = '';
    let valueArealvl3 = '';

    for (const item of allComponents) {
      const value = item.long_name;
  
      for (const type of item.types) {
        switch (type) {
          case 'postal_code':
            setPostalCode(value);
            break;
          case 'route':
            setStreet(value);
            setStreetDireccion(value);
            break;
          case 'street_number':
            setStreetNumber(value);
            break;
          case 'neighborhood':
          case 'sublocality':
          case 'sublocality_level_1':
            setNeighborhood(value);
            coloniaExist = true;
            break;
          case 'locality':
            valueLocality = value;
            break;
          case 'administrative_area_level_1':
            setState(value);
            break;
          case 'administrative_area_level_3':
            valueArealvl3 = value;
            break;
          default:
            break;
        }       
      }
    }

    if(valueArealvl3){
      setLocality(valueArealvl3);
    } else if(valueLocality){
      setLocality(valueLocality);
    }

    setColoniaError(!coloniaExist)

  }

  return (
      <>
      <Map
          mapId={'bf51a910020fa25a'}
          style={{height: '400px'}}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          disableDefaultUI={true}
          cameraControl={true}
          cameraControlOptions={{position: ControlPosition.LEFT_BOTTOM}}
          zoomControl={true}
          keyboardShortcuts={true}
          gestureHandling={'greedy'}
          draggable={true}
          onClick={HandleMapClick}
      >

      <AdvancedMarker
        ref={markerRef}
        position={markerPosition}
        draggable
        onDragEnd={handleMarkerDragEnd}
      />
      </Map>
      </>
  );
}
