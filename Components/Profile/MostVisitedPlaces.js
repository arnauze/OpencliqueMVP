import React from 'react'
import { View, Text, Image } from 'react-native'

export default class MostVisitedPlaces extends React.Component {
    render() {
        return (
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{height: 1, width: 110, backgroundColor: "black"}} />
                    <Text style={{ marginRight: 10, marginLeft: 10, fontWeight: "600" }}>Most visited places</Text>
                    <View style={{height: 1, width: 110, backgroundColor: "black"}} />
                </View>
                <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Image
                        source={require('../../Images/MapIcons/Bar/bar.png')}
                        style={{height: 26, width: 26, marginRight: 10}}
                        />
                        <Text>901 Bar & Grill - Los Angeles, CA</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Image
                        source={require('../../Images/MapIcons/Park/park.png')}
                        style={{height: 26, width: 24, marginRight: 10}}
                        />
                        <Text>Alumni park - Los Angeles, CA</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                        <Image
                        source={require('../../Images/MapIcons/Restaurant/restaurant.png')}
                        style={{height: 30, width: 19, marginRight: 10}}
                        />
                        <Text>Matignon - Paris, France</Text>
                    </View>
                </View>
            </View>
        )
    }
}