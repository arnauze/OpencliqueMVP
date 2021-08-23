import { google_api_key } from '../env'

const key = google_api_key

export function fromGeolocationToAddress(lat, lng) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + key
    return fetch(url).then((response) => response.json())
}