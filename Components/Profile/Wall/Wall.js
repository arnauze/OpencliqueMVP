import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { API, Storage } from 'aws-amplify';
import PendingWall from './PendingWall'
import PostWall from './PostWall'
import UpcomingEvents from './UpcomingEvents'
import { NavigationEvents } from "react-navigation"

export default class Wall extends React.Component {

    state = {

        loading: true

    }

    getInformations = async () => {
        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.username + '/wall'
        let myInit = {}

        console.log("Getting wall")

        var wall = await API.get(apiName, path, myInit)
        
        console.log("Got wall", wall)

        path = '/users/' + this.props.user.username + '/bookings'

        console.log("Getting events")

        var events = await API.get(apiName, path, myInit)

        console.log("Got events", wall)

        this.setState({
            ...this.state,
            wall: wall,
            events: events,
            loading: false
        })
    }

    async componentDidMount() {

        this.getInformations()

    }

    // _onDidFocus = () => {
    //     // First I output the loading indicator
    //     this.setState({
    //         ...this.state,
    //         loading: true
    //     })
    //     // And I get the wall informations (async function)
    //     this.getInformations()
    // }

    render() {

        console.log("State in Wall:", this.state)

        if (this.state.loading) {

            return (
                <View
                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                    <ActivityIndicator size="large"/>
                </View>
            )

        } else {
            return (
                <View>
                    {/* <NavigationEvents
                    onDidFocus={() => this._onDidFocus()}
                    /> */}
                    <UpcomingEvents events={this.state.events} navigation={this.props.navigation}/>
                    {
                        this.props.isFriend ? null : 
                        <PendingWall items={this.state.wall.pending} user={this.props.user} refresh={this.getInformations} navigation={this.props.navigation}/>
                    }
                    <PostWall items={this.state.wall.post} user={this.props.user} navigation={this.props.navigation}/>
                </View>
            )

        }

    }
}