import React from 'react'
import { TouchableOpacity, Image, View } from 'react-native'

export default class MapSettings extends React.Component {
    render() {
        return (
            <View
            style={{top: 10, left: 10, position: 'absolute'}}
            >
                <TouchableOpacity
                style={{margin: 5}}
                onPress={() => this.props.navigation.navigate('Settings')}
                >
                    <Image source={require('../../Images/filters.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}