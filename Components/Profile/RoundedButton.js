import React from 'react'
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'

export default class RoundedButton extends React.Component {

    _findRequiredImage() {
        if (this.props.data.icon == '../../Images/boutique.png') {
            return (require('../../Images/boutique.png'))
        }
        else if (this.props.data.icon == '../../Images/leaderboard.png') {
            return (require('../../Images/leaderboard.png'))
        }
        else if (this.props.data.icon == '../../Images/achievements.png') {
            return (require('../../Images/achievements.png'))
        }
        else {
            return (require('../../Images/message.png'))
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <TouchableOpacity
                style={[styles.container, {backgroundColor: this.props.color ? this.props.color : 'rgba(0, 0, 255, 0.7)'}]}
                onPress={() => this.props.navigation.navigate(this.props.data.text)}
                >
                    <Image
                    source={this._findRequiredImage()}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    main_container: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        flex: 1
    }
})