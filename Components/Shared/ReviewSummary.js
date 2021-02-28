import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { AirbnbRating } from 'react-native-ratings'
import { barColor, restaurantColor, publicEventColor } from '../../Styles/styles'

import Amplify, { Storage } from 'aws-amplify'
import awsmobile from '../../aws-exports'
Amplify.configure(awsmobile);

import { timeDifference } from '../Functions/functions'

import { connect } from 'react-redux'

class ReviewSummary extends React.Component {

    _getStyle = () => {


        // switch(this.props.place.flames) {
        //     case 1:
        //         return {width: 31, height: 31}
        //         break;
        //     case 2:
        //         return {width: 31, height: 31}
        //         break;
        //     case 3:
        //         return {width: 31, height: 31}
        //         break;
        //     case 4:
        //         return {width: 31, height: 31}
        //         break;
        //     case 5:
        //         return {width: 31, height: 31}
        //         break;
        //     default:
        //         return {}
        //         break;
        // }

        return { width: 31, height: 31, margin: 10 }

    }

    _getImage = () => {

        if (this.props.review.place_info.amenity === "bar") {
            return require('../../Images/MapIcons/Bar/bar.png')
        } else if (this.props.review.place_info.amenity === "restaurant") {
            return require('../../Images/MapIcons/Restaurant/restaurant.png')
        } else {
            return require('../../Images/MapIcons/Event/event.png')
        }

    }

    _getTextColor = () => {
        if (this.props.review.place_info.amenity === "bar") {
            return {color: barColor}
        } else if (this.props.review.place_info.amenity === "restaurant") {
            return {color: restaurantColor}
        } else {
            return {color: publicEventColor}
        }
    }

    render() {

        var now = Date.now()
        var then = this.props.review.timestamp

        var time = timeDifference(now, then)

        return (

            <View style={{width: '100%', backgroundColor: 'white', alignItems: 'center'}}>
                <Image style={this._getStyle()} source={this._getImage()}/>
                <Text style={[{ fontWeight: 'bold' }, this._getTextColor()]}>{this.props.review.place_info.name}</Text>
                <Text style={{color: 'gray', margin: 10}}>{time.number} {time.timeframe} ago</Text>
                <View style={{margin: 10, marginTop: 0}}>
                    <AirbnbRating
                    count={5}
                    isDisabled={true}
                    defaultRating={this.props.review.rating}
                    size={30}
                    showRating={false}
                    />
                </View>
                {
                    this.props.review.description === "." ? null :
                    <Text style={{margin: 10}}>{this.props.review.description}</Text>
                }
            </View>
        )

    }
}

const mapStateToProps = state => {
    return {
        connectedUser: state.user
    }
}

export default connect(mapStateToProps)(ReviewSummary)