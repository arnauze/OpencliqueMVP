import React from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import { API, Storage } from 'aws-amplify'
import { NavigationEvents } from "react-navigation"
import StatusSummary from '../Shared/StatusSummary'
import { timeDifference } from '../Functions/functions'
import SocialHeader from '../Shared/SocialHeader'
import SocialBar from '../Shared/SocialBar'

export default class PlaceWall extends React.Component {

    state = {

        loading: true

    }

    getInformations = async () => {
        let apiName = 'Openclique'
        let path = '/places/' + this.props.place_id + '/wall'
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(wall => {
            this.setState({
                ...this.state,
                wall: wall,
                loading: false
            })
        })
        .catch(error => {
            console.log(error.response)
        })
        
    }

    componentDidMount() {

        this.getInformations()

    }

    _onDidFocus = () => {
        // First I output the loading indicator
        this.setState({
            ...this.state,
            loading: true
        })
        // And I get the wall informations (async function)
        this.getInformations()
    }

    render() {

        if (this.state.loading) {

            return (
                <View
                style={{flex: 1}}
                >
                    <Text>Loading...</Text>
                </View>
            )

        } else {
            return (
                <View>
                    <NavigationEvents
                    onDidFocus={() => this._onDidFocus()}
                    />
                    {
                        this.state.wall.map((item, index) => {
                            return (
                                <View key={index} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                                    <SocialHeader
                                    user={this.props.user}
                                    navigation={this.props.navigation}
                                    timeDifference={timeDifference(Date.now(), item.timestamp)}
                                    inFlux={false}
                                    item={item}
                                    />
                                    <StatusSummary
                                    editable={false}
                                    status={{ data: item }}
                                    title={item.title}
                                    description={item.description}
                                    />
                                    <SocialBar
                                    navigation={this.props.navigation}
                                    item={item.social}
                                    user={item.user_id}
                                    item_id={item.id}
                                    full_item={item}
                                    typeOfPost={"status"}
                                    />
                                </View>
                            )
                        })
                    }
                </View>
            )

        }

    }
}