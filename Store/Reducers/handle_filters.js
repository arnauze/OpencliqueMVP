import { API } from 'aws-amplify'

var initialState = {
    globalSuggestions: [],
    filters: [],
    openFilter: false,
    openMenu: false,
    openTab: 'Wall',
    openSearch: false,
    user: {
        isConnected: false,
        currentLocation: {},
        object: {},
        character: {
            avatar: {
                skin: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                },
                eyes: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                },
                hair: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                }
            },
            items: {
                hat: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                },
                top: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                },
                bottom: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                },
                shoes: {
                    url: "",
                    width: -1,
                    height: -1,
                    top: null,
                    left: null
                }
            }
        }
    },
    region: {},
    notifications: []
}

export function transformActionValue(text) {
    let newFilter
    if (text === 'Hotels') {
        newFilter = 'lodging'
    }
    else if (text === 'Restaurants') {
        newFilter = 'restaurant'
    }
    else if (text === 'Open') {
        newFilter = 'open'
    }
    else if (text === 'Gym') {
        newFilter = 'gym'
    }
    else if (text === 'Events') {
        newFilter = 'events'
    }
    return newFilter
}

export default function changeFilter(state = initialState, action) {
    let nextState
    switch(action.type) {
        case 'CHANGE_REGION':
            if (!action.value) {
                nextState = {
                    ...state,
                    region: {}
                }
            } else {
                nextState = {
                    ...state,
                    region: {
                        latitude: action.value.lat,
                        longitude: action.value.lng
                    }
                }
            }
            return nextState || state
        case 'CHANGE_FILTERS':

            console.log("Changing filters:", action)

            nextState = {
                ...state,
                filters: action.value.filters
            }

            if (action.value.user.preferences.filters !== action.value.filters) {

                console.log(action.value.user.preferences.filters)
                console.log(action.value.filters)

                let apiName = 'Openclique'
                let path = '/users/' + action.value.user.username + '/preferences'
                let myInit = {
                    body: {
                        filters: action.value.filters
                    }
                }

                API.post(apiName, path, myInit)
                .then(response => {
                    console.log("Changed preferences!", response)
                })
                .catch(error => {
                    console.log(error.response)
                })

            }

            return nextState || state

        case 'CHANGE_FILTER':

            console.log("Changing filter:", action)

            const filterIndex = state.filters.indexOf(action.value)

            if (filterIndex !== -1) {
                nextState = {
                    ...state,
                    filters: state.filters.filter((item, index) => index !== filterIndex)
                }
            }
            else {
                nextState = {
                    ...state,
                    filters: [...state.filters, action.value]
                }
            }
            return nextState || state

        case 'CHANGE_SEARCH':
            if (action.value === true) {
                nextState = {
                    ...state,
                    openSearch: false
                }
            } else {
                nextState = {
                    ...state,
                    openSearch: true
                }
            }
            return nextState || state
        case 'CHANGE_OPEN_MENU':
            if (action.value === false) {
                nextState = {
                    ...state,
                    openMenu: true
                }
            }
            else {
                nextState = {
                    ...state,
                    openMenu: false
                }
            }
            return nextState || state
        case 'CHANGE_OPEN_FILTER':
            if (action.value === false) {
                nextState = {
                    ...state,
                    openFilter: true
                }
            }
            else {
                nextState = {
                    ...state,
                    openFilter: false
                }
            }
            return nextState || state
        case 'CHANGE_OPEN_TAB':
            if (state.openTab !== action.value) {
                nextState = {
                    ...state,
                    openTab: action.value
                }
            }
            return nextState || state
        case 'UPDATE_CHARACTER_ITEM':
            nextState = {
                ...state,
                user: {
                    ...state.user,
                    character: {
                        ...state.user.character,
                        items: {
                            ...state.user.character.items,
                            [action.value.type]: action.value.item
                        }
                    }
                }
            }
            return nextState || state
        case 'CHANGE_CONNECTED_USER':
            console.log("Inside redux")
            if (state.user.isConnected) {

                // Disconnects the user and send us back to the log in page

                nextState = {
                    ...state,
                    user: {
                        isConnected: false,
                        object: {}
                    }
                }
            }
            else {

                // Connects the user and send us to the main page

                if (action.value.signInUserSession) {

                    // Case if it is a user reconnecting after already being connected
                    nextState = {
                        ...state,
                        user: {
                            isConnected: true,
                            isFirstConnection: false,
                            id: action.value.signInUserSession.accessToken.payload.sub,
                            username: action.value.signInUserSession.accessToken.payload.username
                        }
                    }
                }
                else {
                    console.log("In part I want")

                    // Case if it is a user connecting for the first time or after a long time

                    // if (action.value.is_first_connection) {
                    //     nextState = {
                    //         ...state,
                    //         user: {
                    //             isConnected: true,
                    //             isFirstConnection: true,
                    //             info: action.value
                    //         }
                    //     }
                    // }
                    // else {
                        nextState = {
                            ...state,
                            user: {
                                isConnected: true,
                                isFirstConnection: false,
                                info: action.value.info,
                                jwtToken: action.token,
                                currentLocation: {
                                    latitude: action.value.info.location.lat,
                                    longitude: action.value.info.location.lng
                                },
                                character: action.value.character
                            }
                        }
                        console.log(nextState);
                    }

                // }
            }
            return nextState || state
        case 'ADD_MEDIA':
            if (action.value.media) {
                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        info: {
                            ...state.user.info,
                            media: action.value.media
                        }
                    }
                }
            }
            return nextState || state
        case 'ADD_NOTIFICATION':
            nextState = {
                ...state,
                notifications: [...state.notifications, action.notification]
            }
            return nextState || state
        case 'DELETE_CHAT_NOTIF':
            nextState = {
                ...state,
                notifications: state.notifications.filter(item => item.chat_id !== action.value)
            }
            return nextState || state

        case 'UPDATE_SUGGESTIONS':
            nextState = {
                ...state,
                globalSuggestions: action.value.suggestions
            }
            return nextState || state
        case 'UPDATE_USER':
            if (action.value.name) {
                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        info: {
                            ...state.user.info,
                            first_name: action.value.name.first_name,
                            last_name: action.value.name.last_name,
                            full_name: action.value.name.full_name
                        }
                    }
                }
            } else if (action.value.bio) {
                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        info: {
                            ...state.user.info,
                            bio: action.value.bio
                        }
                    }
                }
            } else if (action.value.followings) {
                if (action.value.followings.action === 'ADD_FOLLOWING') {
                    nextState = {
                        ...state,
                        user: {
                            ...state.user,
                            info: {
                                ...state.user.info,
                                followings: [...state.user.info.followings, action.value.followings.username]
                            }
                        }
                    }
                } else if (action.value.followings.action === 'REMOVE_FOLLOWING') {
                    nextState = {
                        ...state,
                        user: {
                            ...state.user,
                            info: {
                                ...state.user.info,
                                followings: state.user.info.followings.filter(item => item !== action.value.followings.username)
                            }
                        }
                    }
                }
            } else if (action.value.followers) {
                if (action.value.followers.action === 'ADD_FOLLOWER') {
                    nextState = {
                        ...state,
                        user: {
                            ...state.user,
                            info: {
                                ...state.user.info,
                                followers: [...state.user.info.followers, action.value.followers.username]
                            }
                        }
                    }
                } else {
                    nextState = {
                        ...state,
                        user: {
                            ...state.user,
                            info: {
                                ...state.user.info,
                                followers: state.followers.filter(item => item !== action.value.followers.username)
                            }
                        }
                    }
                }
            } else if (action.value.reviews) {
                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        info: {
                            ...state.user.info,
                            reviews: action.value.reviews
                        }
                    }
                }
            } else if (action.value.full) {
                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        info: action.value.user
                    }
                }
            } else if (action.value.location) {

                console.log("Modifying location")
                
                let apiName = 'Openclique'
                let path = '/users/' + state.user.info.username + '/location'
                let myInit = {
                    body: {
                        location: {
                            lat: action.value.location.latitude,
                            lng: action.value.location.longitude
                        }
                    }
                }

                API.post(apiName, path, myInit)
                .then(response => {

                    console.log(response)

                })
                .catch(error => {

                    console.log(error.response)

                })

                nextState = {
                    ...state,
                    user: {
                        ...state.user,
                        currentLocation: {
                            latitude: action.value.location.latitude,
                            longitude: action.value.location.longitude
                        }
                    }
                }

            }
            return nextState || state
        default:
            return state
    }
}