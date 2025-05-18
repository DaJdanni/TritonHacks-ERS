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
    private displayLocation: Position = {lat: 0.00, lng: 0.00};
    private importantLocations: Position[] = [];
    private wildFireLocations: Position[]  = [{lat: 0.00, lng: 0.00}];
    private wildFireData: string = '';

    public overrideDefaultDisplay = false;

    /*

     */

    getUserLocation() {
        return this.userLocation;
    }

    getWildFireData() {
        return this.wildFireData;
    }

    getImportantLocations() {
        return this.importantLocations;
    }

    getWildFireLocations() {
        return this.wildFireLocations;
    }

    getDisplayLocation() {
        return this.displayLocation;
    }

    setDisplayLocation(lat: number, lng: number) {
        this.displayLocation.lat = lat;
        this.displayLocation.lng = lng;
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

    addToMapData(data: any[]) {

        if (data.length === 0) {return};

        if (data.length === 1) {
            this.overrideDefaultDisplay = true;
            this.displayLocation = {lat: data[0][0], lng: data[0][1]};
            this.importantLocations.push({lat: data[0][0], lng: data[0][1]});
            return;
        }

        console.log(data, data.length);

        for (var i = 0; i < data.length; i++) {
            let info = data[i];
            console.log(info, info[2], info[1], info[0]);
            if (info[2].toLowerCase() != "danger") {
                this.importantLocations.push({lat: info[0], lng: info[1]});
            }
        }

        this.overrideDefaultDisplay = true;
        this.displayLocation = {lat: data[0][0], lng: data[0][1]};
        this.importantLocations.push({lat: data[0][0], lng: data[0][1]});
        return;
    }


}

const userData = new MapData();

try {
    const apiKey = import.meta.env.VITE_WILDFIRE_API_KEY;
    if (!apiKey) throw new Error("API key is undefined");

    await fetch(`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${import.meta.env.VITE_WILDFIRE_API_KEY}/VIIRS_NOAA20_NRT/-124,32,-114,42/3`)
   .then(response => response.text())
   .then(parsedResponse => Papa.parse<any>(parsedResponse))
   .catch(err => console.log(err))
   .then((parsedResponse: any) => {

        if (!parsedResponse || !parsedResponse.data) {
            console.log("Parsed response is incorrect");
        }

        console.log(parsedResponse.data);
        console.log(typeof(parsedResponse.data));
    
        // wildFireData[1][0] => latitude

        let wildfirePositions: Position[] = [];
        let data: string = 'Latitude and Longitudes of Wildfires:\n';
        
        for (let i = 1; i < parsedResponse.data.length - 1; i++) {
            const parsedLine: string = parsedResponse.data[i][1] + ', ' + parsedResponse.data[i][0] + ', ' + parsedResponse.data[i][2] + '\n';
            wildfirePositions.push({
              lat: Number(parsedResponse.data[i][1]), 
              lng: Number(parsedResponse.data[i][0])
            });

            data += parsedLine;
        }

        userData.setWildFireData(data);
        userData.setWildFireLocations(wildfirePositions);

        // userData.getWildFireLocations().map((map) => {
        //     console.log(typeof(map.lat), typeof(map.lng));
        // })

    }); // print out all the arrays
} catch {
    console.error("Could not get wildfire data");
}



export default userData;