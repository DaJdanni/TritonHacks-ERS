//!nonstrict
import Papa from 'papaparse'

interface Position {
    lng: number,
    lat: number,
}
/*
wildFires = [position, extra data]
shelters = [position, capacity]
*/


// data => iterate through it and take the lat/long and input into fireLocation var


// note: use an api to iterate through all possible wildfires near the user
class MapData {
    private userLocation: Position = {lat: 0.00, lng: 0.00};
    private campLocation: Position | null = null;
    private wildFireLocations: Position[]  = [{lat: 0.00, lng: 0.00}];
    private wildFireData: string = '';

    /*

     */

    getUserLocation() {
        return this.userLocation;
    }

    setUserLocation(lng: number, lat: number) {
        this.userLocation.lat = lat;
        this.userLocation.lng = lng;
    }

    setWildFireLocations(locations: Position[]) {
        this.wildFireLocations = locations;
    }

    setWildFireData(data: string) {
        this.wildFireData = data;
    }

    getWildFireData() {
        return this.wildFireData;
    }

    getCampLocation() {
        return this.campLocation;
    }

    getWildFireLocations() {
        return this.wildFireLocations;
    }

}

const userData = new MapData();

await fetch(`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${import.meta.env.VITE_WILDFIRE_API_KEY}/VIIRS_NOAA20_NRT/-124,32,-114,42/7`)
   .then(response => response.text())
   .then(parsedResponse => Papa.parse<any>(parsedResponse))
   .catch(err => console.log(err))
   .then((parsedResponse: any) => {

        console.log(parsedResponse.data);
        console.log(typeof(parsedResponse.data));
    
        // wildFireData[1][0] => latitude

        let wildfirePositions: Position[] = [];
        let data: string = 'Latitude and Longitudes of Wildfires:\n';
        
        for (let i = 1; i < parsedResponse.data.length - 1; i++) {
            const parsedLine: string = parsedResponse.data[i][1] + ', ' + parsedResponse.data[i][0] + '\n'
            wildfirePositions.push({lng: Number(parsedResponse.data[i][1]), lat: Number(parsedResponse.data[i][0])});
            data += parsedLine;
        }

        userData.setWildFireData(data);
        userData.setWildFireLocations(wildfirePositions);

        // userData.getWildFireLocations().map((map) => {
        //     console.log(typeof(map.lat), typeof(map.lng));
        // })

}); // print out all the arrays


export default userData;