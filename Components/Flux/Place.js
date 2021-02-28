import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

export default class Place extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('PlaceDetail', {item: this.props.place})}>
                <View style={styles.main_container}>
                    <Image 
                    source={require('../../Images/the_view_image.png')}
                    style={styles.image}
                    />
                    <Text style={styles.text}>{this.props.place}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        width: 100
    },
    main_container: {
        alignItems: 'center',
        flex: 1,
        margin: 2
    },
    image: {
        width: 75,
        height: 50
    }
})