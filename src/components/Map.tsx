import React from 'react'
import {AdvancedMarker, APIProvider, Map, Pin} from '@vis.gl/react-google-maps';
import userData from '../lib/MapData'

const icons = import.meta.glob('/src/assets/*.{png,jpg,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

interface Position {
  lng: number,
  lat: number,
}



const GoogleMap: React.FC = React.memo(() => {

    const [userLocation, setUserLocation] = React.useState<Position | null>(null);
    // const [wildFireLocations, setWFLocations] = React.useState('');
     
    React.useEffect(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates: Position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coordinates);
          userData.setUserLocation(coordinates.lng, coordinates.lat);
        }
      )
    });

    // React.useEffect(() => {
    //     const location = userData.getDisplayLocation();
    //     console.log("Setting display to: " + location.lat + ", " + location.lng);

    //     if (location.lat < 0) {
    //       setDisplay({lat: location.lng, lng: location.lat});
    //     } else {
    //       setDisplay(location);
    //     }

    //     userData.overrideDefaultDisplay = false;
    // });


    return (
        <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        { (userLocation) ? (
          <Map
          className='w-screen h-screen'
          disableDefaultUI={true}
          defaultZoom={18}
          defaultCenter={ { lat: userLocation?.lat, lng: userLocation?.lng } }
          colorScheme='DARK'
          mapId='DEMO_MAP_ID'
          >
        {userData.getWildFireLocations().map((map, index) => (
          <AdvancedMarker key={index} position={{lat: map.lng, lng: map.lat}}>
          {/* <Pin
            background={'#92230c'}
            borderColor={'#92230c'}
            glyphColor={'#751804'}
          /> */}
          <img src={icons['/src/assets/wildfire.png']} width={62} height={62} />
          </AdvancedMarker>
        ))}
        {userData.getImportantLocations().map((map, index) => (
          <AdvancedMarker key={index} position={{lat: map.lat, lng: map.lng}}>
          <Pin
            background={'#92230c'}
            borderColor={'#92230c'}
            glyphColor={'#751804'}
          />
          {/* <img src={icons['/src/assets/wildfire.png']} width={62} height={62} /> */}
          </AdvancedMarker>
        ))}

        <AdvancedMarker position={{lat: userLocation.lat, lng: userLocation.lng}}></AdvancedMarker>
        </Map>
        
        ) : (
          <p>Input your location </p>
        )}
     </APIProvider>
    )
});

export default GoogleMap;