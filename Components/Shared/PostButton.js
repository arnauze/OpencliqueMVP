import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

export default class PostButton extends React.Component {
    render() {

        return (

            <TouchableOpacity
            style={{alignSelf: 'center', width: this.props.width, height: this.props.height, backgroundColor: this.props.backgroundColor, alignItems: 'center', justifyContent: 'center', margin: 10, borderRadius: this.props.borderRadius}}
            onPress={this.props.onPress}
            >
                <Text style={{color: 'white', fontWeight: '500'}}>{this.props.text}</Text>
            </TouchableOpacity>

        )

    }
}