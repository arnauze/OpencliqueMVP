import React from 'react'
import { View, Text, Image } from 'react-native'
import { Marker } from 'react-native-maps'
import { Storage, API } from 'aws-amplify'
import MapboxGL from '@react-native-mapbox-gl/maps';
import { flyToAnimationSpeed } from '../../Styles/styles';
import Character from '../Character/Character';
import { connect } from 'react-redux'

MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

export default class UserMarker extends React.Component {

    state = {
        items: []
    }

    componentDidMount() {
        this._getUser()
    }

    _isPressed = () => {
        return this.props.openCallout === this.props.user
    }

    _getUser = () => {

        let apiName = 'Openclique'
        let path = '/items/user/' + this.props.user.username
        let myInit = {
            body: {
                wearing: true
            }
        }

        var itemsUrl = []

        API.get(apiName, path, myInit)
        .then(response => {

            response.map(item => {

                Storage.get(item.path, {level: 'public'})
                .then(data => {

                    itemsUrl.push({url: data, item: item})

                    this.setState({

                        ...this.state,
                        items: itemsUrl
        
                    })

                })

            })

        })
        .catch(error => {

            console.log(error.response)

        })

    }

    getExtraStyle = (item) => {

        if (item.item.type === "shoes") {

            if (item.item.side === "right") {
                return { left: this._isPressed() ? item.item.left * 2 : item.item.left }
            } else {
                return { right: this._isPressed() ? item.item.right * 2 : item.item.right }
            }

        }

    }

    onPointClicked = () => {
        // let timer = flyToAnimationSpeed;
        // this.props.camera.flyTo([this.props.location.lng, this.props.location.lat], timer)
        // setTimeout(() => this.props.camera.zoomTo(15), timer + (timer / 10))
        // this.props.showCallout(this.props.user)
    }

    render() {
        return (
            <MapboxGL.PointAnnotation
            coordinate={[this.props.location.lng, this.props.location.lat]}
            onSelected={this.onPointClicked}
            anchor={{x: 0.5, y: 1}}
            id={this.props.user.username}
            >
                <View style={{alignItems: 'center'}}>
                    {/* <Image 
                    source={require('../../Images/avatar.png')}
                    style={{width: this._isPressed() ? 24 : 20, height: this._isPressed() ? 88 : 74, position: 'relative'}}
                    />
                    {
                        this.state.items.map((item, index) => {

                            return (
                                <Image
                                key={index}
                                source={{url: item.url}}
                                style={[{
                                    position: 'absolute',
                                    height: this._isPressed() ? (item.item.height / 3) + (item.item.height / 5) : item.item.height / 3,
                                    width: this._isPressed() ? (item.item.width / 3) + (item.item.width / 5) : item.item.width / 3,
                                    top: this._isPressed() ? (item.item.top / 3) + (item.item.top / 5) : item.item.top / 3
                                }, this.getExtraStyle(item)]}
                                />
                            )

                        })
                    } */}
                    <Character
                    isUserMarker={true}
                    disabled={true}
                    navigation={this.props.navigation}
                    isMapNotClicked={!this._isPressed()}
                    isMapClicked={this._isPressed()}
                    character={this.props.character}
                    isCurrentUser={this.props.isCurrentUser}
                    username="arnauze"
                    />
                </View>
            </MapboxGL.PointAnnotation>
        )
    }
}