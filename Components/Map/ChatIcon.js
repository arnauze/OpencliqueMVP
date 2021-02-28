import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'

export default class ChatIcon extends React.Component {
    render() {
        return (
            <TouchableOpacity
            style={styles.main_container}
            onPress={() => this.props.navigation.navigate('Chat')}
            >
                <Image source={require('../../Images/chat_icon.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        margin: 5
    }
})