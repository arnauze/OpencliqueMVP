import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps';
import { flyToAnimationSpeed } from '../../Styles/styles';
MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

export default class PoiMarker extends React.Component {

    _renderImage = (item) => {
        if (this.props.user.places_visited.indexOf(item.id) >= 0) {
            return (require('../../Images/MapIcons/known_point.png'))
        } else {
            return (require('../../Images/MapIcons/unknown_point.png'))
        }
    }

    onPointClicked = () => {
        let timer = flyToAnimationSpeed;
        this.props.camera.flyTo([this.props.item.lon, this.props.item.lat], timer)
        setTimeout(() => this.props.camera.zoomTo(15), timer + (timer / 10))
        this.props.showCallout(this.props.item)
    }

    render() {
        var item = this.props.item
        return (
            <MapboxGL.PointAnnotation
            coordinate={[item.coords.lng, item.coords.lat]}
            onSelected={this.onPointClicked}
            >
                <View style={{alignItems: 'center'}}>
                    <Image
                    source={this._renderImage(item)}
                    style={{width: this.props.openCallout === item ? 40 : 25, height: this.props.openCallout === item ? 40 : 25}}
                    />
                    <Text style={{fontSize: 11}}>{item.name}</Text>
                </View>
            </MapboxGL.PointAnnotation>
        )
    }

}