import axios from "axios";

    
async function getNearbyLocations(latitude: number, longitude: number)    {
    await axios.post('https://places.googleapis.com/v1/places:searchNearby', {
        includedTypes: ["hospital", "supermarket", "fire_station"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: latitude,
              longitude: longitude
            },
            radius: 1693.4
          }
        }
      }, {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.displayName"
        }
      }).then((response) => {
        return response.data;
      }).catch((error) => {
        console.error(error.response?.data || error.message);
      });
}  

export default getNearbyLocations;