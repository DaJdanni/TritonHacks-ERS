import userData from './MapData';
import axios from 'axios'

const filterResponse = (response: string) => {
    let userResponse = response.replace(/\*\*(.*?)\*\*/g, '$1');
    let startSplit = userResponse.indexOf("LOCATION_DATA");
    userResponse = userResponse.slice(0, startSplit);
    let formattedData = response.slice(startSplit+14).trim();

    console.log(userResponse, formattedData);
    
    return response
    .replace(/\*\*(.*?)\*\*/g, '$1');
}

const fetchResponse = async (prompt: string) => {

    let formattedAddress: string = '';

    const getAddress = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${userData.getUserLocation().lat},${userData.getUserLocation().lng}&key=${import.meta.env.VITE_MAPS_API_KEY}`)
    .then(response => response.json())
    .then((response: any) => {
        formattedAddress = response.results[0].formatted_address;
    })
    .catch((error) => {
        console.log(error);
    })

    const cri = 
    `
    You are a emergency first response AI assistant designed to help users prepare, evaluate their current situtation, and
    ultimately support the user during any type of emergency. You are NOT to get off topic whatsoever, focus on the problem at hand.\n

    The users live location is: ${formattedAddress}.\n
    Some of the current wildfires near the user:\n${userData.getWildFireData()}\n

    Here are some basic rules to follow when responding to the user:\n
    -Whenever you give the user information regarding location, do not use latitude and longitude. Refer to place names at all times but remember to get the closest location based off of the latitude and longitudes you're given.\n
    -Write clear and concise locations that are easily understood
    -Alert the user of potential dangers nearby

    VERY IMPORTANT RULE:\n
    If you bring up a location to the user, at the end of the message create another two lines that follow this format:\n
    LOCATION_DATA
    lat, lng, type
    Refer to this dictionary: 
    lat = latitude of location you mentioned
    lng = longtitude of location you mentioned
    type = [natural diaster or danger? -> DANGER, shelter or basic location? -> NORMAL]
    `

    const crisisPrompt = `You are a highly capable and compassionate AI assistant. The user's current location is ${formattedAddress}.
Use this real-time location to provide accurate, local, and actionable support during any emergency or crisis situation.

Here are some of the current wildfires near the user:\n${userData.getWildFireData()}

Your primary goal is to assist the user quickly and effectively, prioritizing their safety and well-being. You may use their coordinates to:
- Find and suggest nearby hospitals, police stations, shelters, or safe zones
- Provide directions or emergency services contact info
- Alert the user to nearby dangers (natural disasters, violence, etc.)
- Offer mental health or first-aid guidance relevant to their location

Whenever you give the user information regarding location, do not use latitude and longitude. Refer to place names at all times but remember to get the closest location based off of the latitude and longitudes you're given.

Always stay calm, clear, and supportive. Your responses must be grounded in the user's current geographic context. Confirm their surroundings or situation if needed.
Make sure to write short and when you give locations do not include '**' and other puncations however if you believe the situtation requires more information to be told to the user, then say more. Otherwise, stay concise.`;
    const response = await axios.post("http://localhost:8080/api/gemini/", {
      systemInstruction: cri,
      userPrompt: prompt
    });
    console.log(filterResponse(response.data));

    return filterResponse(response.data);
  }


export default fetchResponse;