import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'

// Imports from Components/Map
import Map from '../Components/Map/Map'
import SuggestReport from '../Components/Map/SuggestReport'
import Frame from '../Components/Map/StatusPanel/Frame'

// Import from Components/Shared
import BugsReport from '../Components/Shared/BugsReport'
import SendBugReport from '../Components/Shared/SendBugReport'

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
    }
}, {
    navigationOptions: ({ navigation }) => ({
        header: null,
      }),
})

const CommunityStack = createStackNavigator({
    SuggestReport: {
        screen: SuggestReport,
        navigationOptions: {
            header: null
        }
    },
    BugsReport: {
        screen: BugsReport,
        navigationOptions: {
            title: 'I spotted a bug',
            header: null
        }
    },
    SendBugReport: {
        screen: SendBugReport,
        navigationOptions: {
            title: 'Bug',
            header: null
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
                        source={require('../Images/suggestions_black.png')}
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
                        style={{height: 32, width: 35}}
                        />
                    )
                } else {
                    return (
                        <Image
                        source={require('../Images/map_black.png')}
                        style={{height: 28, width: 30}}
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
                            source={require('../Images/community_black.png')}
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
            style: { backgroundColor: "white" },
            activeTintColor: appColor
        },
        resetOnBlur: true,
        initialRouteName: 'Map'
})

export default createAppContainer(BottomTabNavigator)