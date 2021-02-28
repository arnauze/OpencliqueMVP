import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class UserRank extends React.Component {
    render() {
        return (
            <View style={styles.user_rank}>
                <View style={styles.container}>
                    <Text style={{marginLeft: 5}}>{this.props.rank}</Text>
                    <View style={styles.profile_picture}></View>
                    <Text>{this.props.user.name}</Text>
                </View>
                <View style={styles.container}>
                    <Text style={{marginRight: 5}}>{this.props.level}</Text>
                    <Text style={{marginRight: 5}}>{this.props.user.points} CP</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    user_rank: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    profile_picture: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        borderWidth: 0.5,
        margin: 10
    },
})