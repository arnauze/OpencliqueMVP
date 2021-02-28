import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class ReviewTopBar extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Text style={styles.location_name}>{this.props.location.name}</Text>
                <Text style={{fontSize: 16, fontWeight: '300'}}>{this.props.type}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        height: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5
    },
    location_name: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8
    }
})