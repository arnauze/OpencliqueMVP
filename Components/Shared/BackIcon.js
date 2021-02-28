import React from 'react'
import { Image, TouchableOpacity } from 'react-native'

export default class BackIcon extends React.Component {
    render() {
        return (
            <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            >
                <Image
                source={require("../../Images/back_icon.png")}
                style={{ width: 21, height: 12, marginLeft: 10, transform: [{ rotate: "90deg" }] }}
                />
            </TouchableOpacity>
        )
    }
}