import React from 'react'
import { View, StyleSheet, Text, Button, Image } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

export default class EventMarker extends React.Component {

    _isPressed = () => {
        return this.props.item === this.props.openCallout
    }

    onPointClicked = () => {
        let timer = flyToAnimationSpeed;
        this.props.camera.flyTo([this.props.item.geometry.lon, this.props.item.geometry.lat], timer)
        setTimeout(() => this.props.camera.zoomTo(15), timer + (timer / 10))
        this.props.showCallout(this.props.item)
    }

    render() {
        
        var item = this.props.item

        return (
            <MapboxGL.PointAnnotation
            coordinate={[item.geometry.lng, item.geometry.lat]}
            onSelected={this.onPointClicked}
            >
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center', maxWidth: this._isPressed() ? 80 : 120}}>
                    <Image
                    source={require('../../Images/MapIcons/Event/event.png')}
                    style={{width: this._isPressed() ? 40 : 20, height: this._isPressed() ? 40 : 20}}
                    />
                    <Text style={{fontWeight: '500', color: '#0A6FF7', textAlign: 'center', fontSize: this._isPressed() ? 15 : 12}}>{item.name}</Text>
                </View>
            </MapboxGL.PointAnnotation>
        )
    }
}
