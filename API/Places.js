import { google_api_key } from '../env'

const key = google_api_key

export function findNearbyPlace(location, filter) {

    console.log("Function findNearbyPlace:")
    console.log("Filters:", filter)

    if (!filter || filter.length === 0) {

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&radius=1500&key=' + key
        return fetch(url).then((response) => response.json())

    } else if (filter.length >= 1 && filter.indexOf('Restaurant' >= 0)) {

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&type=restaurant&radius=1500&key=' + key
        return fetch(url).then((response) => response.json())

    } else if (filter.length >= 1 && filter.indexOf('Bar') >= 0) {

        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&type=bar&radius=1500&key=' + key
        return fetch(url).then((response) => response.json())

    }

    // if (!filter) {
        // const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&radius=1500&key=' + key
        // return fetch(url).then((response) => response.json())
    // } else {
    //     if (filter !== 'open') {
    //         const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&type=' + filter + '&radius=1500&key=' + key
    //         return fetch(url).then((response) => response.json())
    //     } else {
    //         const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + location.latitude + ',' + location.longitude + '&opennow&radius=1500&key=' + key
    //         return fetch(url).then((response) => response.json())
    //     }
    // }
}

export function findPlaceDetail(placeId) {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?key=' + key + '&placeid=' + placeId
    console.log(url)
    return fetch(url).then((response) => response.json())
}

export function findDistance(origin, destination) {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + origin.lat + ',' + origin.lng + '&destinations=' + destination.lat + ',' + destination.lng + '&key=' + key
    console.log(url)
    return fetch(url).then((response) => response.json())
}

export function findPlacesByName(name) {
    const url = "https://maps.googleapis.com/maps/api/place/textsearch/json?input=" + name + "&key=" + key
    console.log(url)
    return fetch(url).then((response) => response.json())
}