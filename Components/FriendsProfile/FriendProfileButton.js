import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'

export default class FriendProfileButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={() => alert("Button clicked")} style={{marginRight: 10}}>
                <Image source={require("../../Images/friend_profile_button.png")} />
            </TouchableOpacity>
        )
    }
}