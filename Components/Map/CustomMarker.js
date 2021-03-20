import React from 'react'
import LottieView from 'lottie-react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { flyToAnimationSpeed } from '../../Styles/styles';
import { View, Text } from 'react-native'
MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

export default class CustomMarker extends React.Component {

    _renderAnimation(item) {
        if (!this.props.isCluster) {
            if (this.props.user.places_liked.indexOf(item.rangeKey) >= 0) {
                return (require('../../Animations/map_icons/liked.json'))
            } else {
                if (item.type === "coffee_and_tea") {
                    return (require('../../Animations/map_icons/coffee.json'))
                } else if (item.type === "restaurant") {
                    return (require('../../Animations/map_icons/restaurant.json'))
                } else if (item.type === "nightlife") {
                    return (require('../../Animations/map_icons/nightlife.json'))
                } else if (item.type === "nature") {
                    return (require('../../Animations/map_icons/nature.json'))
                } else if (item.type === "culture") {
                    return (require('../../Animations/map_icons/culture.json'))
                } 
            }
        } else {
            return (require('../../Animations/map_icons/culture.json'))
        }
    }

    onPointClicked = () => {
        let timer = flyToAnimationSpeed;
        let lat = this.props.item.geoJson.coordinates[1]
        let lon = this.props.item.geoJson.coordinates[0]
        this.props.camera.flyTo([lon, lat], timer)
        setTimeout(() => this.props.camera.zoomTo(15), timer + (timer / 10))
        this.props.showCallout(this.props.item)
    }

    render() {
        var item = this.props.item
        var lat
        var lon
        if (!this.props.isCluster) {
            lat = item.geoJson.coordinates[1]
            lon = item.geoJson.coordinates[0]
        } else {
            lat = item.center[0]
            lon = item.center[1]
        }
        return (
            <MapboxGL.PointAnnotation
                id={(lat + lon).toString()}
                coordinate={[lon, lat]}
                onSelected={this.props.isCluster ? null : this.onPointClicked}
            >
                <View style={{ alignItems: 'center' }}>
                    <View
                    style={{width: 30, height: 30, borderRadius: 30, backgroundColor: "rgba(0,0,0,0.3)", transform: [{ translateY: 60 }] }}
                    />
                    <LottieView
                        style={{ width: 50, height: 50  }}
                        source={this._renderAnimation(item)}
                        autoPlay
                        loop
                    />
                    {
                        this.props.isCluster
                        ?
                            <Text style={{maxWidth: 150, textAlign: 'center', color: "white", fontWeight: "600", marginTop: 10}}>{item.points.length}</Text>
                        :
                            <Text style={{maxWidth: 150, textAlign: 'center', color: "white", fontWeight: "600", marginTop: 10}}>{item.name}</Text>
                    }
                </View>
            </MapboxGL.PointAnnotation>
        )
    }
}
