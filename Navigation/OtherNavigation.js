import { createAppContainer, createStackNavigator } from 'react-navigation'
import React from 'react'
import { Text } from 'react-native'

// Imports from Components/Connection
import SignIn from '../Components/Connection/SignIn'
import SignUp from '../Components/Connection/SignUp'
import MainPage from '../Components/Connection/MainPage'

const ConnectionStackNavigator = createStackNavigator({
    MainPage: {
        screen: MainPage,
        navigationOptions: {
            header: null
        }
    },
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            header: null
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    }
},
{
    tabBarOptions: {
        activeBackgroundColor: '#FEA35D',
        inactiveBackgroundColor: 'white'
    }
}
)

export default createAppContainer(ConnectionStackNavigator)