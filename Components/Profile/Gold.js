import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { appColor } from '../../Styles/styles';

export default class Gold extends React.Component {
    render() {
        return (
            <View style={{marginRight: 7}}>
                <Text style={{fontWeight: 'bold'}}>Gold: <Text style={{color: appColor, fontWeight: 'bold'}}>{this.props.navigation.getParam('user').gold}</Text></Text>
            </View>
        )
    }
}