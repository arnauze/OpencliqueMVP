import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default class BookingSummary extends React.Component {

    render() {

        console.log(this.props)

        var booking = this.props.booking

        return (
            <TouchableOpacity
            style={{ width: '100%', flexDirection: 'row'}}
            onPress={() => {
                console.log("Pressed the booking summary !")
                this.props.navigation.navigate('EventDetail', { item: booking })
            }}
            >
                <View style={{flex: 2, backgroundColor: 'lightgray', margin: 5}}>
                </View>
                <View style={{flex: 8, marginLeft: 7}}>
                    <Text style={{fontWeight: 'bold'}}>{booking.name}</Text>
                    <Text>From {booking.date.start_hour.hours}:{booking.date.start_hour.minutes} to {booking.date.end_hour.hours}:{booking.date.end_hour.minutes}</Text>
                    <TouchableOpacity
                    style={{height: 25, width: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F05463'}}
                    onPress={() => console.log("Pressed the button in the booking summary !")}
                    >
                        <Text>Add people</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>...</Text>
                </View>
            </TouchableOpacity>
        )

    }

}