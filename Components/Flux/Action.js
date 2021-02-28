import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class Action extends React.Component {

    _displayTime() {
        if (this.props.time.timeframe === 'hours' || this.props.time.timeframe === 'hour') {
            return this.props.time.number > 1 ? this.props.time.number + ' hours ' : this.props.time.number + ' hour '
        } else if (this.props.time.timeframe === 'minutes' || this.props.time.timeframe === 'minute') {
            return this.props.time.number > 1 ? this.props.time.number + ' minutes ' : this.props.time.number + ' minute '
        } else if (this.props.time.timeframe === 'months' || this.props.time.timeframe === 'month') {
            return this.props.time.number > 1 ? this.props.time.number + ' months ' : this.props.time.number + ' month '
        } else {
            return this.props.time.number > 1 ? this.props.time.number + ' days ' : this.props.time.number + ' day '
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <Text style={styles.action}>{this.props.type}</Text>
                <Text style={styles.time}>{this._displayTime()}ago</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    action: {
        textAlign: 'center',
        marginBottom: 17,
        marginTop: 10,
        fontWeight: 'bold'
    },
    time: {
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 10
    },
    main_container: {
        alignItems: 'center',
        flex: 1
    }
})