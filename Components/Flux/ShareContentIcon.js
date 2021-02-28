import React from 'react'
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native'

export default class ShareContentIcon extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.container}
            onPress={() => this.props.navigation.navigate('ShareContent')}
            >
                <Image source={require('../../Images/add.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginRight: 20
    }
})