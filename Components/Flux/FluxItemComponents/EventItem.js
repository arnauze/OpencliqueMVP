import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import Geocoder from 'react-native-geocoder'
import { peopleInterestedByEvent, toLowerCase, timeDifference, getBrackets, getBracketColor, getMonth } from '../../Functions/functions'

import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../../../aws-exports';
Amplify.configure(awsmobile);

class EventItem extends React.Component {

    state = {
        loading: true
    }

    async componentDidMount() {

        var apiName = 'Openclique'
        var path = '/users/' + this.props.item.creator
        var myInit = {}

        let response = await API.get(apiName, path, myInit)

        let profilePicture = await Storage.get(response.Item.profile_picture, {level: 'public'})
        var medias = []

        if (this.props.item.medias.length > 0) {
            var i = -1
            while (++i < this.props.item.medias.length) {
                let ret = await Storage.get(this.props.item.medias[i], {level: 'public'})
                medias.push(ret)
            }
        }

        this.setState({
            event: this.props.item,
            timeOfReview: timeDifference(Date.now(), this.props.item.timestamp),
            loading: false,
            eventCreatorInformations: response.Item,
            bracket: getBrackets(response.Item.cliquepoints),
            profilePicture: profilePicture,
            flux: this.props.flux,
            medias: medias,
            loading: false
        })

    }

    _updateFluxItem = () => {

        var apiName = 'Openclique'
        var path = '/flux/' + this.props.item.id
        var myInit = {}

        API.get(apiName, path, myInit)
            .then(response => {

                this.setState({
                    ...this.state,
                    flux: response.Item
                })

            })
            .catch(error => {

                console.log(error.response)

            })

    }

    // Function that gets the lat and lng of the address, puts the informations in the global state and then navigate to the Map

    _updateRegionAndNavigate = (address) => {
        
        // First we get the lat and lng from the address

        Geocoder.geocodeAddress(address)
        .then(res => {
            var position = res[0].position

            // Then we update the global state 

            let action = {
                type: 'CHANGE_REGION',
                value: position
            }
            this.props.dispatch(action)

            // And we navigate to the Map with the new informations stored in the global state

            this.props.navigation.navigate('Map')
        })
        .catch(err => console.log(err))
    }

    _onPress = () => {

        // Function called when we click on the user's name or profile picture

        if (this.props.user.info.username === this.state.eventCreatorInformations.username) {

            // We're clicking on our own name so we navigate to our own profile page

            this.props.navigation.navigate('Profile')

        } else {

            // We're clicking on a friend's name so we move to the friend's profile page

            this.props.navigation.navigate('FriendsProfile', { user: this.state.eventCreatorInformations })

        }

    }

    render() {

        // I need to work on the display of the events in this.state.event_info

        console.log("Props I'm looking for:", this.props)
        console.log("State I'm looking for:", this.state)

         if (!this.state.loading) {

            var event = this.state.event
            var eventCreator = this.state.eventCreatorInformations
            var date = this.state.event.date.day.split('/')

            return (
                <View>
                    <View style={styles.top_bar}>
                        <TouchableOpacity
                        style={styles.user_informations}
                        onPress={() => this._onPress()}
                        >
                            <View>
                                <Image
                                style={styles.profile_picture}
                                source={{url: this.state.profilePicture}}
                                />
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <Text style={{color: getBracketColor(this.state.bracket)}}>{eventCreator.full_name}</Text>
                                <Text style={{color: getBracketColor(this.state.bracket)}}>{this.state.bracket}</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 4, alignItems: 'center', alignSelf: 'center'}}>
                            <Text style={{fontWeight: '600'}}>created a {toLowerCase(event.privacy)} event</Text>
                            <Text style={{fontSize: 10}}>{this.state.timeOfReview.number} {this.state.timeOfReview.timeframe} ago</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <TouchableOpacity>
                                <Text style={{fontSize: 10, margin: 2}}>ooo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{width: '100%', height: 200, backgroundColor: 'lightgray'}}>
                        <Image source={{uri: this.state.medias[0]}} style={{flex: 1}}/>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 2, alignItems: 'center'}}>
                            <Text style={{fontSize: 18, marginTop: 7, color: '#EB5757', fontWeight: 'bold'}}>{getMonth(date[0]).substring(0, 3)}.</Text>
                            <Text style={{fontSize: 18, color: '#EB5757', fontWeight: 'bold'}}>{date[1]}</Text>
                        </View>
                        <View style={{flex: 6, margin: 5}}>
                            <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('EventDetail', { item: event })}
                            >
                                <Text style={{fontWeight: 'bold'}}>{event.name}</Text>
                            </TouchableOpacity>
                            <Text style={{color: '#EB5757'}}>
                                {event.date.start_hour.hours}:{event.date.start_hour.minutes}
                                    <Text style={{color: 'black'}}>
                                     - {event.address}
                                    </Text>
                            </Text>
                            <Text style={{fontWeight: '100'}}>{peopleInterestedByEvent(event)} people are participating</Text>
                            <Text>You are {!event.guests_invites ? 'not ' : null}allowed to invite people</Text>
                        </View>
                        <View style={{flex: 3, left: -10, top: 10, alignItems: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../../Images/Flames/empty_flame.png')} style={{width: 13, height: 17, margin: 2.5}}/>
                                <Image source={require('../../../Images/Flames/empty_flame.png')} style={{width: 13, height: 17, margin: 2.5}}/>
                                <Image source={require('../../../Images/Flames/empty_flame.png')} style={{width: 13, height: 17, margin: 2.5}}/>
                                <Image source={require('../../../Images/Flames/empty_flame.png')} style={{width: 13, height: 17, margin: 2.5}}/>
                                <Image source={require('../../../Images/Flames/empty_flame.png')} style={{width: 13, height: 17, margin: 2.5}}/>
                            </View>
                            <TouchableOpacity
                            style={{height: 15, width: 15, borderRadius: 7.5, borderColor: 'blue', borderWidth: 0.5, justifyContent: 'center', alignItems: 'center', marginTop: 5}}
                            >
                                <Text style={{color: 'blue', fontSize: 10}}>i</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )

        } else {

            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color="#F2994A" />
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    top_bar: {
        flexDirection: 'row',
        flex: 1
    },
    user_informations: {
        flex: 4,
        flexDirection: 'row'
    },
    profile_picture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0.5,
        margin: 5
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(EventItem)