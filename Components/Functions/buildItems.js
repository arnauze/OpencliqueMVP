import { API } from 'aws-amplify';

const baseItemUrl = "https://openclique-dev.s3-us-west-1.amazonaws.com/public/items/"
const ITEMS = [
    {
        name: "Skin 8",
        url: baseItemUrl + "skin_8.png",
        type: "skin",
        top: null,
        bottom: null,
        left: null,
        right: null,
        width: 77.98,
        height: 252.7,
        rarity: "common",
        gender: "both"
    },
]

export function buildItems() {
    console.log("TRYING TO BUILD ITEMS");
    let apiName = 'Openclique'
    let path = '/items'
    let myInit = {}

    API.post(apiName, path, myInit)
    .then(response => {
        
        console.log("SUCCESS");
        console.log(response)

    })
    .catch(error => {

        console.log("ERROR");
        console.log(error.response)

    })

}