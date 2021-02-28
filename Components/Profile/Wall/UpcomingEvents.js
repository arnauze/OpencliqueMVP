import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { appColor } from '../../../Styles/styles'
import EventSummary from '../../Shared/EventSummary';

export default class UpcomingEvents extends React.Component {

    render() {
            
            if (this.props.events.length > 0) {

                return (
                    <View style={{borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                        <View style={{margin: 10}}>
                            <Text style={{color: appColor, fontWeight: 'bold', margin: 7}}>COMING EVENTS</Text>
                            <ScrollView
                            alwaysBounceHorizontal={false}
                            horizontal
                            >
                                {
                                    this.props.events.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                            key={index}
                                            onPress={() => this.props.navigation.navigate('EventDetail', {item: item})}
                                            >
                                                <EventSummary event={item}/>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                )
    
            } else return null

    }
}