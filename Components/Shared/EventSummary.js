import React from 'react'
import { View, Text, Image } from 'react-native'
import { appColor } from '../../Styles/styles'

export default class EventSummary extends React.Component {

    // address: "14 Rue de la Chapelle, 75018 Paris, France"
    // admins: []
    // creator: "arnauze"
    // date:
    // day: "09/04/2019"
    // end_hour: {hours: "6", minutes: "00"}
    // start_hour: {hours: "1", minutes: "00"}
    // description: "New description here"
    // geometry: {lng: 2.360003122099909, lat: 48.89109575376605}
    // guests: {invited: Array(0), coming: Array(1), interested: Array(0)}
    // id: "1567600849855.3862"
    // medias: []
    // name: "New event"
    // privacy: "Public"
    // timestamp: 1567600849855

    render() {

        var event = this.props.event

        return (
            
            <View style={{maxWidth: 180, margin: 5}}>
                <View style={{width: 180, height: 100, backgroundColor: 'lightgray'}}>
                    <View style={{position: 'absolute', top: 5, right: 5, height: 30, width: 30, borderRadius: 15, borderWidth: 0.5, backgroundColor: 'white'}}>
            
                    </View>
                </View>
                <Text style={{color: appColor}}>{event.date.day}, {event.date.start_hour.hours}:{event.date.start_hour.minutes} - {event.date.end_hour.hours}:{event.date.end_hour.minutes}</Text>
                <Text style={{fontWeight: 'bold'}}>{event.name}</Text>
                <Text style={{color: "#8F8E94"}}>Thomas and 3 people</Text>
            </View>

        )

    }

}