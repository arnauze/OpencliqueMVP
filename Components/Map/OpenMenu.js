import React from 'react'
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native'

export default class OpenMenu extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this.props.navigation.navigate('CreateEvent', {userKey: this.props.userKey})}
                >
                    <Image source={require('../../Images/menu_yellow_icon.png')}/>
                    <Text style={styles.text}>Create an event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this.props.navigation.navigate('MyEvents')}
                >
                    <Image source={require('../../Images/menu_orange_icon.png')}/>
                    <Text style={styles.text}>My events</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this.props.navigation.push('LeaveReview')}
                >
                    <Image source={require('../../Images/menu_red_icon.png')}/>
                    <Text style={styles.text}>Leave a review</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this.props.navigation.navigate('Preferences')}
                >
                    <Image source={require('../../Images/menu_orange_icon.png')}/>
                    <Text style={styles.text}>Preferences</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this.props.navigation.navigate('Settings')}
                >
                    <Image source={require('../../Images/menu_red_icon.png')}/>
                    <Text style={styles.text}>Settings</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        margin: 10,
        flexDirection: 'row'
    },
    container: {
        backgroundColor: '#333333',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 10,
        borderRadius: 10,
        width: 120
    },
    text: {
        marginLeft: 5,
        marginRight: 5,
        color: 'white'
    }
})