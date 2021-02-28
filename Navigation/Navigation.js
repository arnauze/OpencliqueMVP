import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'

// Imports from Components/Flux
import Flux from '../Components/Flux/Flux'
import ShareContent from '../Components/Flux/ShareContent'
import AddMedia from '../Components/Flux/AddMedia'
import ShareLocation from '../Components/Flux/ShareLocation'
import LeaveReview from '../Components/Flux/LeaveReview'

// Imports from Components/Map
import Map from '../Components/Map/Map'
import Preferences from '../Components/Map/Preferences'
import Settings from '../Components/Map/Settings'
import MyEvents from '../Components/Map/MyEvents'
import SuggestReport from '../Components/Map/SuggestReport'
import CalendarComponent from '../Components/Map/CalendarComponent'
import PostImage from '../Components/Map/StatusPanel/PostImage'
import Frame from '../Components/Map/StatusPanel/Frame'

// Imports from Components/Profile
import Profile from '../Components/Profile/Profile'
import Achievements from '../Components/Profile/Achievements/Achievements'
import Boutique from '../Components/Profile/Boutique'
import ModifyProfile from '../Components/Profile/ModifyProfile'
import FollowersPage from '../Components/Profile/FollowersPage'
import FollowingsPage from '../Components/Profile/FollowingsPage'
import ModifyCharacter from '../Components/Profile/ModifyCharacter'
import ItemsCollection from '../Components/Profile/ItemsCollection'
import ItemDescription from '../Components/Profile/ItemDescription'
import Leaderboard from '../Components/Leaderboard/Leaderboard'

// Imports from Components/FriendsProfile
import FriendsProfile from '../Components/FriendsProfile/FriendsProfile'

// Imports from Components/Event
import PickLocation from '../Components/Event/PickLocation'
import CreateEvent from '../Components/Event/CreateEvent'
import ListUsers from '../Components/Event/ListUsers'

// Import from Components/Shared
import ReviewPlace from '../Components/Shared/ReviewPlace'
import InviteFriends from '../Components/Shared/InviteFriends'
import DisplayStatus from '../Components/Shared/DisplayStatus'
import BugsReport from '../Components/Shared/BugsReport'
import SendBugReport from '../Components/Shared/SendBugReport'

import {fromLeft, fromRight, fromBottom} from 'react-navigation-transitions';
import { appColor } from '../Styles/styles';

const SuggestionStack = createStackNavigator({
    Frame: {
        screen: Frame,
        navigationOptions: {
            header: null
        }
    }
}, {
    navigationOptions: ({ navigation }) => ({
        tabBarVisible:  true,
      })
})

const MapStackNavigator = createStackNavigator({
    Map: {
      screen: Map,
      navigationOptions: {
        header: null
      }
    },
    PickLocation: {
        screen: PickLocation
    },
}, {
    navigationOptions: ({ navigation }) => ({
        header: null,
      }),
    //   transitionConfig: nav => {
    //       if (nav.scenes[nav.scenes.length - 1].route.routeName == "SuggestReport" ||
    //         nav.scenes[nav.scenes.length - 1].route.routeName == "Settings" || 
    //         nav.scenes[nav.scenes.length - 1].route.routeName == "Frame") {
    //           return fromBottom()
    //       } else {
    //           return fromRight()
    //       }
    //   }
})

const CommunityStack = createStackNavigator({
    SuggestReport: {
        screen: SuggestReport,
        navigationOptions: {
            header: null
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            title: 'Settings',
            header: null
        }
    },
    BugsReport: {
        screen: BugsReport,
        navigationOptions: {
            title: 'I spotted a bug'
        }
    },
    SendBugReport: {
        screen: SendBugReport,
        navigationOptions: {
            title: 'Bug'
        }
    },
}, {
    navigationOptions: ({ navigation }) => ({
        tabBarVisible:  true,
      })
})

const BottomTabNavigator = createBottomTabNavigator({
    Suggestion: {
        screen: SuggestionStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => {
                if (tintColor === appColor) {
                    return (
                        <Image
                        source={require('../Images/suggestions_red.png')}
                        style={{height: 20, width: 25}}
                        />
                    )
                } else {
                    return (
                        <Image
                        source={require('../Images/suggestions_white.png')}
                        style={{height: 20, width: 25}}
                        />
                    )
                }
            }
        }
    },
    Map: {
        screen: MapStackNavigator,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => {
                if (tintColor === appColor) {
                    return (
                        <Image
                        source={require('../Images/map_red.png')}
                        style={{height: 25, width: 21}}
                        />
                    )
                } else {
                    return (
                        <Image
                        source={require('../Images/map_white.png')}
                        style={{height: 25, width: 21}}
                        />
                    )
                }
            }
        }
    },
    CommunityStack: {
        screen: CommunityStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => {
                if (tintColor === appColor) {
                    return (
                        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                            <Image
                            source={require('../Images/community_red.png')}
                            style={{height: 24, width: 25}}
                            />
                        </View>
                    )
                } else {
                    return (
                        <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                            <Image
                            source={require('../Images/community_white.png')}
                            style={{height: 24, width: 25}}
                            />
                        </View>
                    )
                }
            }
        }
    }
}, {
       tabBarOptions: {
            showLabel: false,
            showIcon: true,
            style: { backgroundColor: "black" },
            activeTintColor: appColor
        },
        resetOnBlur: true,
        initialRouteName: 'Map'
})

export default createAppContainer(BottomTabNavigator)