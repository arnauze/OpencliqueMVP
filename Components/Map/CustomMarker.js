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
                switch (item.flames) {
                    case 0:
                        return (require('../../Animations/animations/liked_icon/liked_0_flames.json'))
                        break
                    case 1:
                        return (require('../../Animations/animations/liked_icon/liked_1_flames.json'))
                        break
                    case 2:
                        return (require('../../Animations/animations/liked_icon/liked_2_flames.json'))
                        break
                    case 3:
                        return (require('../../Animations/animations/liked_icon/liked_3_flames.json'))
                        break
                    case 4:
                        return (require('../../Animations/animations/liked_icon/liked_4_flames.json'))
                        break
                    case 5:
                        return (require('../../Animations/animations/liked_icon/liked_5_flames.json'))
                        break
                }
            } else {
                if (item.type === "coffee_and_tea") {
                    switch (item.flames) {
                        case 0:
                            return (require('../../Animations/animations/coffee_icon/coffee_0_flames.json'))
                            break
                        case 1:
                            return (require('../../Animations/animations/coffee_icon/coffee_1_flames.json'))
                            break
                        case 2:
                            return (require('../../Animations/animations/coffee_icon/coffee_2_flames.json'))
                            break
                        case 3:
                            return (require('../../Animations/animations/coffee_icon/coffee_3_flames.json'))
                            break
                        case 4:
                            return (require('../../Animations/animations/coffee_icon/coffee_4_flames.json'))
                            break
                        case 5:
                            return (require('../../Animations/animations/coffee_icon/coffee_5_flames.json'))
                            break
                    }
                } else if (item.type === "restaurant") {
                    switch (item.flames) {
                        case 0:
                            return (require('../../Animations/animations/food_icon/food_0_flames.json'))
                            break
                        case 1:
                            return (require('../../Animations/animations/food_icon/food_1_flames.json'))
                            break
                        case 2:
                            return (require('../../Animations/animations/food_icon/food_2_flames.json'))
                            break
                        case 3:
                            return (require('../../Animations/animations/food_icon/food_3_flames.json'))
                            break
                        case 4:
                            return (require('../../Animations/animations/food_icon/food_4_flames.json'))
                            break
                        case 5:
                            return (require('../../Animations/animations/food_icon/food_5_flames.json'))
                            break
                    }
                } else if (item.type === "nightlife") {
                    switch (item.flames) {
                        case 0:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_0_flames.json'))
                            break
                        case 1:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_1_flames.json'))
                            break
                        case 2:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_2_flames.json'))
                            break
                        case 3:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_3_flames.json'))
                            break
                        case 4:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_4_flames.json'))
                            break
                        case 5:
                            return (require('../../Animations/animations/nightlife_icon/nightlife_5_flames.json'))
                            break
                    }
                } else if (item.type === "nature") {
                    switch (item.flames) {
                        case 0:
                            return (require('../../Animations/animations/nature_icon/nature_0_flames.json'))
                            break
                        case 1:
                            return (require('../../Animations/animations/nature_icon/nature_1_flames.json'))
                            break
                        case 2:
                            return (require('../../Animations/animations/nature_icon/nature_2_flames.json'))
                            break
                        case 3:
                            return (require('../../Animations/animations/nature_icon/nature_3_flames.json'))
                            break
                        case 4:
                            return (require('../../Animations/animations/nature_icon/nature_4_flames.json'))
                            break
                        case 5:
                            return (require('../../Animations/animations/nature_icon/nature_5_flames.json'))
                            break
                    }
                } else if (item.type === "culture") {
                    switch (item.flames) {
                        case 0:
                            return (require('../../Animations/animations/culture_icon/culture_0_flames.json'))
                            break
                        case 1:
                            return (require('../../Animations/animations/culture_icon/culture_1_flames.json'))
                            break
                        case 2:
                            return (require('../../Animations/animations/culture_icon/culture_2_flames.json'))
                            break
                        case 3:
                            return (require('../../Animations/animations/culture_icon/culture_3_flames.json'))
                            break
                        case 4:
                            return (require('../../Animations/animations/culture_icon/culture_4_flames.json'))
                            break
                        case 5:
                            return (require('../../Animations/animations/culture_icon/culture_5_flames.json'))
                            break
                    }
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
                    style={{width: 30, height: 30, borderRadius: 30, backgroundColor: "rgba(0,0,0,0.3)", transform: [{ translateY: this.props.isCluster ? 60 : 80 }, { translateX: this.props.isCluster ? 0 : -2 }] }}
                    />
                    <LottieView
                        style={{ width: this.props.isCluster ? 50 : 70, height: this.props.isCluster ? 50 : 70  }}
                        source={this._renderAnimation(item)}
                        autoPlay
                        loop
                    />
                    {
                        this.props.isCluster
                        ?
                            <Text style={{maxWidth: 150, textAlign: 'center', color: "black", fontWeight: "600", marginTop: 10}}>{item.points.length}</Text>
                        :
                            <Text style={{maxWidth: 150, textAlign: 'center', color: "black", fontWeight: "600", marginTop: 10}}>{item.name}</Text>
                    }
                </View>
            </MapboxGL.PointAnnotation>
        )
    }
}
