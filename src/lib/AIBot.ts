import userData from './MapData';
import axios from 'axios'

const filterResponse = (response: string) => {
    let userResponse = response.replace(/\*\*(.*?)\*\*/g, '$1');
    // let startSplit = userResponse.indexOf("LOCATION_DATA");
    let formattedData = userResponse.split("LOCATION_DATA")[1];
    userResponse = userResponse.split("LOCATION_DATA")[0].trim();

    console.log("default response: " + response + "\n");
    console.log("send user this:\n" + userResponse + "\n", "give server this:\n" + formattedData + "\n");


    // if (formattedData !== undefined) {
    //   let data = JSON.parse(formattedData);
    //   console.log("Sending data to frontend..." + data.locations);

    //   userData.addToMapData(data.locations);
    // }

    return userResponse;
}

function formatPlaceNames(objectData: any) {
  const places = objectData.places || [];

  return places.map((place: { displayName: { text: any; }; }) => `  ${place.displayName.text}`).join('\n');
}

const fetchResponse = async (prompt: string) => {

    let formattedAddress: string = '';

    let lat = userData.getUserLocation().lat;
    let lng = userData.getUserLocation().lng;
    

   await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userData.getUserLocation().lat},${userData.getUserLocation().lng}&key=${import.meta.env.VITE_MAPS_API_KEY}`)
    .then(response => response.json())
    .then((response: any) => {
        formattedAddress = response.results[0].formatted_address;
    })
    .catch((error) => {
        console.log(error);
    })

    const dataLocations = await axios.post(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        includedTypes: ["hospital", "supermarket", "fire_station"],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng},
            radius: 1693.4
          }
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_MAPS_API_KEY,
          "X-Goog-FieldMask": "places.displayName",
        },
      }
    );

    console.log(dataLocations.data);
    console.log(formatPlaceNames(dataLocations.data));

    const cri = 
    `
    You are a emergency first response AI assistant designed to help users prepare, evaluate their current situtation, and
    ultimately support the user during any type of emergency. You are NOT to get off topic whatsoever, focus on the problem at hand.\n

    The users live location is: ${formattedAddress}.\n
    Some of the current wildfires near the user (lng, lat, Brightness Temperature in Band I4 (Infrared) or intensity in kelvins):\n
    ${userData.getWildFireData()}\n



    Here are some basic rules to follow when responding to the user:\n
    -Whenever you give the user information regarding location, do not use latitude and longitude. Refer to place names at all times but remember to get the closest location based off of the latitude and longitudes you're given.\n
    -Write clear and concise locations that are easily understood
    -Alert the user of potential dangers nearby

    VERY IMPORTANT RULE:
    If you bring up a location to the user, at the end of the message create another two lines that follow this EXACT format:
    LOCATION_DATA
    {
      "locations": [
        [lat, lng, "type"]
      ]
    }
    NO MATTER WHAT, EVEN IF IT’S A SINGULAR LOCATION, INCLUDE A "locations": [] ARRAY IN YOUR FORMAT.
    FOLLOW THE EXAMPLE EXACTLY AS SHOWN ABOVE — INCLUDING THE SQUARE BRACKETS, DOUBLE QUOTES, AND INDENTATION. DO NOT ADD EXTRA FIELDS OR FORMATTING SUCH AS THREE TIDAL KEYS THEN json.

    Refer to this dictionary: 
    lat = latitude of location you mentioned
    lng = longtitude of location you mentioned
    type = [natural diaster or danger? -> DANGER, shelter, other? -> type of location
    `

    const response = await axios.post("api/gemini/", {
      systemInstruction: cri,
      userPrompt: prompt
    });
    console.log(filterResponse(response.data));

    return filterResponse(response.data);
  }


export default fetchResponse;