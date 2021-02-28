import React from 'react'
import { View, Text, Image } from 'react-native'

export default class CurrentStatus extends React.Component {

    // Props:
    //      Place
    //      Flames

    render() {
        return (
            <View style={{alignItems: 'center', marginTop: 15}}>
                <Text style={{fontWeight: "600"}}>{this.props.place}</Text>
                <View style={{flexDirection: 'row'}}>
                    {
                        this.props.flames.map((item, index) => {
                            return (
                                <Image key={index} style={{height: 23, width: 17, margin: 4}} source={require("../../Images/Flames/black_flame.png")}/>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}