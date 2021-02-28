import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { appColor } from '../../Styles/styles';

export default class FriendsListButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate("FollowersPage")}
            style={{flexDirection: 'row', alignItems: 'center'}}
            >
                <View style={{borderRadius: 10, padding: 2, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center', height: 17, width: 17}}>
                    <Text style={{color: "white", fontSize: 12, fontWeight: "600"}}>1</Text>
                </View>
                <Image
                source={require("../../Images/friends_red.png")}
                style={{width: 20, height: 15, marginRight: 10, marginLeft: 3}}
                />
            </TouchableOpacity>
        )
    }
}