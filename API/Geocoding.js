const key = 'AIzaSyAzdc-cory5ZG-Ds4lW3Y8a7D-UgKFlbC0'

export function fromGeolocationToAddress(lat, lng) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + key
    return fetch(url).then((response) => response.json())
}