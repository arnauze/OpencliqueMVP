import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'

export default class CalendarIcon extends React.Component {
    render() {
        return (
            <TouchableOpacity
            style={styles.main_container}
            onPress={() => this.props.navigation.navigate('CalendarComponent')}
            >
                <Image source={require('../../Images/calendar.png')}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        margin: 5
    }
})