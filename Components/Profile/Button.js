import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class Button extends React.Component {

    _changePage(text) {
        if (text === 'Modify the profile') {
            this.props.navigation.navigate('ModifyProfile', {user: this.props.user ? this.props.user : {}})
        } else if (text === 'Modify character') {
            this.props.navigation.navigate('ModifyCharacter', {reload: this.props.reload})
        } else {

        }
    }

    render() {
        return (
            <TouchableOpacity
            style={[styles.button_shape, { margin: this.props.margin}]}
            onPress={() => {
                this._changePage(this.props.text)
            }}
            >
                <Text style={{fontSize: 12}}>{this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button_shape: {
        width: 107,
        height: 27,
        borderRadius: 20,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
})