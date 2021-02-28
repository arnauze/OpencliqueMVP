import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class PostItem extends React.Component {
    render() {
        return (
            <View style={styles.main_container}>
                <Text style={styles.text}>{this.props.item.flux_type.comment}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        minHeight: 50,
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    },
    text: {
        margin: 5
    }
})