import RNFetchBlob from 'rn-fetch-blob';
global.Buffer = require('buffer').Buffer;
import Amplify, {API} from 'aws-amplify'
import { bronzeFeather, silverFeather, goldFeather, platinumFeather, commonItem, uncommonItem, rareItem, epicItem, commonItemAlpha, uncommonItemAlpha, rareItemAlpha, epicItemAlpha } from '../../Styles/styles';

MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

DAYS = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
    '9th',
    '10th',
    '11th',
    '12th',
    '13th',
    '14th',
    '15th',
    '16th',
    '17th',
    '18th',
    '19th',
    '20th',
    '21st',
    '22nd',
    '23rd',
    '24th',
    '25th',
    '26th',
    '27th',
    '28th',
    '29th',
    '30th',
    '31st'
]

export function hoursDifference(timestamp1, timestamp2) {
    var difference = timestamp1 - timestamp2;
    var hoursDifference = Math.floor(difference/1000/60/60);

    return hoursDifference
}

export function readFile(filePath) {
    return RNFetchBlob.fs.readFile(filePath, 'base64').then(data => new Buffer(data, 'base64'));
}

export function timeDifference(timeNow, oldTime) {
    var difference = timeNow - oldTime;
    var hoursDifference = Math.floor(difference/1000/60/60);
    if (hoursDifference < 1) {
        if (Math.floor(difference/1000/60) === 1) {
            return {
                number: Math.floor(difference/1000/60),
                timeframe: 'minute'
            }
        } else {
            return {
                number: Math.floor(difference/1000/60),
                timeframe: 'minutes'
            }
        }
    } else if (hoursDifference >= 24 && hoursDifference < 24 * 30) {
        if (Math.floor(difference/1000/60/60/24) === 1) {
            return {
                number: Math.floor(difference/1000/60/60/24),
                timeframe: 'day'
            }
        } else {
            return {
                number: Math.floor(difference/1000/60/60/24),
                timeframe: 'days'
            }
        }
    } else if (hoursDifference >= 24 * 30) {
        if (Math.floor(difference/1000/60/60/24/30) > 1) {
            return {
                number: Math.floor(difference/1000/60/60/24/30),
                timeframe: 'months'
            }
        } else {
            return {
                number: Math.floor(difference/1000/60/60/24/30),
                timeframe: 'month'
            }
        }
    } else {
        if (hoursDifference === 1) {
            return {
                number: hoursDifference,
                timeframe: 'hour'
            }
        } else {
            return {
                number: hoursDifference,
                timeframe: 'hours'
            }
        }
    }
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false
    }
    return true
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

export function getMonth(number) {

    return MONTHS[number - 1]

}

export function getDay(number) {

    return DAYS[number - 1]

}

export function outputTypeOfMarker(item) {

    if (item && item.tags && item.tags.amenity) {

        // Item is a point of interest on the map from google's API

        if (item.tags.amenity === "hotel") {
            return 'Hotel'
        }
        else if (item.tags.amenity === "restaurant") {
            return 'Restaurant'
        } else if (item.tags.amenity === "bar" || item.tags.amenity === "pub") {
            return 'Bar'
        } else {
            return 'Nothing'
        }

    } else {

        // Item is not from google and most likely is an event created by a user

        if (item && item.privacy) {

            // If the item is indeed an event created by a user

                return item.privacy + ' event'

        }

    }

}

export function peopleInterestedByEvent(item) {

    if (item && item.guests) {

        return item.guests.invited.length + item.guests.coming.length + item.guests.interested.length

    }

}

export function toLowerCase(s) {

    if (typeof s !== 'string') return ''
    return s.charAt(0).toLowerCase() + s.slice(1)

}

export function toUpperCase(s) {

    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)

}

export function toTimestamp(year,month,day,hour,minute,second){

    var datum = new Date(Date.UTC(year,month-1,day,hour,minute,second));

    return datum.getTime()/1000;

}

export function getDistance(lat1, lon1, lat2, lon2) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        
		if (dist > 1)
            dist = 1;
            
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;

		return dist * 1.609344;
	}
}

export async function getLocations(coords, filters, amount = 60) {

    var coordStr = (coords.latitude - (coords.latitudeDelta / 2)) + ',' + (coords.longitude - (coords.longitudeDelta / 2)) + ',' + (coords.latitude + (coords.latitudeDelta / 2)) + ',' + (coords.longitude + (coords.longitudeDelta / 2))
    var returnValue = []
    var url = ""

    if (filters.filter((item) => item !== 'Unknown point' && item !== 'Visited point' && item !== 'Event').length > 0) {

        amount /= filters.length
        let i = -1

        while (++i < filters.length) {
            if (filters[i] !== "Unknown point" && filters[i] !== "Visited point") {
                url = 'https://overpass-api.de/api/interpreter?data=[out:json];node(' + coordStr + ')[amenity='+ filters[i].toLowerCase() +'];out ' + amount + ';'
                let response = await fetch(url).then(response => { return response.json() } )
                returnValue = returnValue.concat(response.elements)
            }
        }

    } else {

        list = ["bar", "restaurant", "nightclub"]

        if (amount === 60)
            amount = 20
        let i = -1
        while (++i < 3) {
            url = 'https://overpass-api.de/api/interpreter?data=[out:json];node(' + coordStr + ')[amenity='+ list[i] +'];out ' + amount + ';'
            let response = await fetch(url).then(response => { return response.json() } )
            returnValue = returnValue.concat(response.elements)
        }

    }

    return returnValue;
}

// --------------------------------------------------------------------------------------------------------------
//  Function handling the gamification
// --------------------------------------------------------------------------------------------------------------

const BRACKETS = [
    {
        points: 0,
        name: 'Bronze IV',
        color: "#49160B",
        image: "../../Images/Brackets/bronze.png"
    },
    {
        points: 1000,
        name: 'Bronze III',
        color: "#7D2411",
        image: "../../Images/Brackets/bronze.png"
    },
    {
        points: 4500,
        name: 'Bronze II',
        color: "#A72B10",
        image: "../../Images/Brackets/bronze.png"
    },
    {
        points: 10500,
        name: 'Bronze I',
        color: "#D72701",
        image: "../../Images/Brackets/bronze.png"
    },
    {
        points: 19000,
        name: 'Silver IV',
        color: "#72797D",
        image: "../../Images/Brackets/silver.png"
    },
    {
        points: 30000,
        name: 'Silver III',
        color: "#A3B2BA",
        image: "../../Images/Brackets/silver.png"
    },
    {
        points: 43500,
        name: 'Silver II',
        color: "#80AEB5",
        image: "../../Images/Brackets/silver.png"
    },
    {
        points: 59500,
        name: 'Silver I',
        color: "#2EABA4",
        image: "../../Images/Brackets/silver.png"
    },
    {
        points: 78000,
        name: 'Gold IV',
        color: "#BEA108",
        image: "../../Images/Brackets/gold.png"
    },
    {
        points: 99000,
        name: 'Gold III',
        color: "#E0AA03",
        image: "../../Images/Brackets/gold.png"
    },
    {
        points: 122500,
        name: 'Gold II',
        color: "#FFD836",
        image: "../../Images/Brackets/gold.png"
    },
    {
        points: 148500,
        name: 'Gold I',
        color: "#F3EA0A",
        image: "../../Images/Brackets/gold.png"
    },
    {
        points: 177000,
        name: 'Platinum IV',
        color: "#8B7799",
        image: "../../Images/Brackets/platinum.png"
    },
    {
        points: 208000,
        name: 'Platinum III',
        color: "#AE97BD",
        image: "../../Images/Brackets/platinum.png"
    },
    {
        points: 241500,
        name: 'Platinum II',
        color: "#D4C4E3",
        image: "../../Images/Brackets/platinum.png"
    },
    {
        points: 277500,
        name: 'Platinum I',
        color: "#CFB6F0",
        image: "../../Images/Brackets/platinum.png"
    },
    {
        points: 316000,
        name: 'Diamond IV',
        color: "#0478B4",
        image: "../../Images/Brackets/diamond.png"
    },
    {
        points: 357000,
        name: 'Diamond III',
        color: "#1B9DDF",
        image: "../../Images/Brackets/diamond.png"
    },
    {
        points: 400500,
        name: 'Diamond II',
        color: "#7BC6DF",
        image: "../../Images/Brackets/diamond.png"
    },
    {
        points: 446500,
        name: 'Diamond I',
        color: "#30C7FF",
        image: "../../Images/Brackets/diamond.png"
    }
]

export function getBrackets(cliquepoints) {
    var i = 0
    while (i < BRACKETS.length) {

        if (cliquepoints <= BRACKETS[i].points)
            return BRACKETS[i].name
        i++;
    }
    return BRACKETS[i - 1].name
}

export function getNextBracketPoints(cliquepoints) {
    var i = 0
    while (i < BRACKETS.length) {

        if (cliquepoints < BRACKETS[i].points)
            return BRACKETS[i].points
        i++;
    }
    return BRACKETS[i - 1].points
}

export function getPreviousBracketsPoints(cliquepoints) {
    var i = 0
    while (i < BRACKETS.length) {

        if (cliquepoints <= BRACKETS[i].points) {
            var points = 0
            while (i >= 0) {
                points += BRACKETS[i].points
                i--;
            }
            return points
        }
        i++;
    }
    return BRACKETS[i - 1].points
}

export function getPreviousBracketPoints(cliquepoints) {
    var i = 0
    while (i < BRACKETS.length) {

        if (cliquepoints <= BRACKETS[i].points)
            if (i === 0)
                return 0
            else
                break
        i++;
    }
    return BRACKETS[i - 1].points
}

export function getBracketColor(bracket) {
    var i = -1
    while (++i < BRACKETS.length) {

        if (bracket == BRACKETS[i].name)
            return BRACKETS[i].color
    }
}

export function getBracketImage(cliquepoints) {
    var i = 0
    while (i < BRACKETS.length) {

        if (cliquepoints <= BRACKETS[i].points)
            return BRACKETS[i].image
        i++;
    }
    return BRACKETS[i - 1].image
}

export function getItemPrice(item) {
    if (item.rarity === 'common') {
        return 50
    } else if (item.rarity === 'uncommon') {
        return 150
    } else if (item.rarity === 'rare') {
        return 500
    } else if (item.rarity === 'epic') {
        return 2000
    } else return 0
}

export function getLevel(cliquepoints) {
    var i = 0;
    var toAdd = 100;
    var max = 100;
    while (++i < 100) {
        if (cliquepoints < max)
            return i;
        toAdd += 100;
        max += toAdd;
    }
    return i;
}

export function getLevelPoints(cliquepoints, type) {
    var i = 0;
    var toAdd = 100;
    var max = 100;
    var previousLevel = 0;
    while (++i < 100) {
        if (cliquepoints < max) {
            return type === "next" ? max : previousLevel;
        }
        previousLevel += toAdd;
        toAdd += 100;
        max += toAdd;
    }
    return i;
}

export function shouldEarned(amount) {
    switch(amount) {
        case 5:
            return {"cp": 250, "gold": 5}
        case 10:
            return {"cp": 500, "gold": 10}
        case 25:
            return {"cp": 1000, "gold": 25}
        case 50:
            return {"cp": 2500, "gold": 50}
        case 100:
            return {"cp": 5000, "gold": 100}
        case 250:
            return {"cp": 10000, "gold": 250}
        default:
            return {"cp": 0, "gold": 0}
    }
}

export function getFeatherColor(featherType) {
    switch(featherType) {
        case "bronze":
            return bronzeFeather;
        case "silver":
            return silverFeather;
        case "gold":
            return goldFeather;
        case "platinum":
            return platinumFeather;
        default:
            return "transparent";
    }
}

export function getRarityColor(item, alpha=false) {
    switch(item.rarity) {
        case "common":
            return alpha ? commonItemAlpha : commonItem;
        case "uncommon":
            return alpha ? uncommonItemAlpha : uncommonItem;
        case "rare":
            return alpha ? rareItemAlpha : rareItem;
        case "epic":
            return alpha ? epicItemAlpha : epicItem;
    }
}

const ACHIEVEMENTS = {
    "event": (user) => {
        return shouldEarned(user.events.length)
    },
    "item": (user) => {
        return shouldEarned(user.items.earned)
    },
    "review": (user) => {
        return shouldEarned(user.reviews.post.length)
    },
    "follow1": (user) => {
        return shouldEarned(user.followings.length)
    },
    "follow2": (user) => {
        return shouldEarned(user.followers.length)
    },
    "connection": (user) => {
        return shouldEarned((user.followings.filter(item => user.followers.findIndex(i => item === i) > 0)).length)
    },
    "status": (user) => {
        return shouldEarned(user.status_total)
    },
    "achievement": (user) => {
        return shouldEarned(user.achievements.length)
    },
    "poi": (user) => {
        return shouldEarned(user.places_visited.length)
    }
}

export default function earnedReward(user, type) {
    console.log("ENTERING ACHIEVEMENTS FUNCTION FOR ", type)
    let reward = ACHIEVEMENTS[type](user)
    console.log("REWARD SELECTED", reward)
    return reward
}

export function getKeyFromUrl(url, prefix = true) {
    let words = url.split("/")
    // console.log(words)
    let length = words.length
    // console.log(length)
    return prefix ? "items/" + words[length - 1] : words[length - 1];
}

export async function fetchAllItems() {
    let apiName = 'Openclique'
    let path = '/items'
    let myInit = {}

    try {
        var items = await API.get(apiName, path, myInit)
        return items;
    } catch (e) {
        console.log("Error fetching all items")
        console.log(e.response || e)
    }
}

export async function fetchAllUserItems(username) {
    let apiName = 'Openclique'
    let path = '/items/user/' + username
    let myInit = {
        body: {
            "wearing": false
        }
    }

    try {
        var items = await API.get(apiName, path, myInit)
        return items;
    } catch (e) {
        console.log("Error fetching all items")
        console.log(e.response || e)
    }
}

export async function fetchWearingItems(username) {
    let apiName = 'Openclique'
    let path = '/items/user/' + username
    let myInit = {
        body: {
            "wearing": true
        }
    }

    try {
        let items = await API.get(apiName, path, myInit)
        return items;
    } catch (e) {
        console.log("Error fetching all items")
        console.log(e.response || e)
    }
}

export async function fetchOneItem(item_id) {
    let apiName = 'Openclique'
    let path = '/items/' + item_id
    let myInit = {}

    try {
        var item = await API.get(apiName, path, myInit)
        return item;
    } catch (e) {
        console.log("Error fetching all items")
        console.log(e.response || e)
    }
}

export function parseTypes(types=[]) {
    let ret = ""
    if (types.indexOf("restaurant") >= 0) {
        ret = "restaurant"
    } else if (types.indexOf("cafe" >= 0) || types.indexOf("tea") >= 0) {
        ret = "coffee_and_tea"
    } else if (types.indexOf("museum" >= 0) || types.indexOf("tourist_attraction") >= 0) {
        ret = "culture"
    } else if (types.indexOf("night_club") >= 0 || types.indexOf("bar") >= 0) {
        ret = "nightlife"
    } else {
        ret = "unknown"
    }
    return ret;
}