import React from 'react'
import { View, Text } from 'react-native'
import { API } from 'aws-amplify'
import EventItem from './EventItem';

export default class BookingItem extends React.Component {

    constructor(props) {
        super(props)

        if (this.props.item.flux_type.booking_type === 'event') {

            let apiName = 'Openclique'
            let path = '/events/' + this.props.item.flux_type.id
            let myInit = {}

            API.get(apiName, path, myInit).then(response => {
                this.setState({
                    booking_info: response.Item
                })
            }).catch(error => {
                console.log(error)
            });

        }

    }

    render() {

        // I need to work on the display of the bookings in this.state.booking_info
        if (this.props.item.flux_type.booking_type === 'event') {
            return (
                <EventItem
                item={this.props.item}
                navigation={this.props.navigation}
                />
            )
        } else {
            return (
                <Text>Booking</Text>
            )
        }
    }
}