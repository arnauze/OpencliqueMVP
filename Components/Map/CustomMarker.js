import React from 'react'
import LottieView from 'lottie-react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { flyToAnimationSpeed } from '../../Styles/styles';
import { View, Text } from 'react-native'
MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

export default class CustomMarker extends React.Component {

    _renderAnimation(item) {
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
        let lat = item.geoJson.coordinates[1]
        let lon = item.geoJson.coordinates[0]
        return (
            <MapboxGL.PointAnnotation
                id={(lat + lon).toString()}
                coordinate={[lon, lat]}
                onSelected={this.onPointClicked}
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
                    <Text style={{maxWidth: 150, textAlign: 'center', color: "white", fontWeight: "600", marginTop: 10}}>{item.name}</Text>
                </View>
            </MapboxGL.PointAnnotation>
        )
    }
}

// import React from 'react'
// import LottieView from 'lottie-react-native';
// import MapboxGL from '@react-native-mapbox-gl/maps';
// import { flyToAnimationSpeed } from '../../Styles/styles';
// import { View, Text } from 'react-native'
// MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");

// export default class CustomMarker extends React.Component {

//     _renderAnimation(item) {
//         // if (this.props.user.places_liked.indexOf(item.rangeKey) >= 0) {
//         //     return (require('../../Animations/map_icons/liked.json'))
//         // } else {
//         //     if (item.type === "coffee_and_tea") {
//         //         return (require('../../Animations/map_icons/coffee.json'))
//         //     } else if (item.type === "restaurant") {
//         //         return (require('../../Animations/map_icons/restaurant.json'))
//         //     } else if (item.type === "nightlife") {
//         //         return (require('../../Animations/map_icons/nightlife.json'))
//         //     } else if (item.type === "nature") {
//         //         return (require('../../Animations/map_icons/nature.json'))
//         //     } else if (item.type === "culture") {
//         //         return (require('../../Animations/map_icons/culture.json'))
//         //     } 
//         // }
//         return (require('../../Animations/map_icons/culture.json'))
//     }

//     onPointClicked = () => {
//         let timer = flyToAnimationSpeed;
//         let lat = this.props.item.geoJson.coordinates[1]
//         let lon = this.props.item.geoJson.coordinates[0]
//         this.props.camera.flyTo([lon, lat], timer)
//         setTimeout(() => this.props.camera.zoomTo(15), timer + (timer / 10))
//         this.props.showCallout(this.props.item)
//     }

//     render() {
//         var item = this.props.item
//         // let lat = item.geoJson.coordinates[1]
//         // let lon = item.geoJson.coordinates[0]
//         let lat = item.center[0]
//         let lon = item.center[1]
//         console.log("\n\nItem here:")
//         console.log(item)
//         return (
//             <MapboxGL.PointAnnotation
//                 id={(lat + lon).toString()}
//                 coordinate={[lon, lat]}
//                 // onSelected={this.onPointClicked}
//             >
//                 <View style={{ alignItems: 'center' }}>
//                     <View
//                     style={{width: 30, height: 30, borderRadius: 30, backgroundColor: "rgba(0,0,0,0.3)", transform: [{ translateY: 60 }] }}
//                     />
//                     <LottieView
//                         style={{ width: 50, height: 50  }}
//                         source={this._renderAnimation(item)}
//                         autoPlay
//                         loop
//                     />
//                     {/* <Text style={{maxWidth: 150, textAlign: 'center', color: "white", fontWeight: "600", marginTop: 10}}>{item.name}</Text> */}
//                     <Text style={{maxWidth: 150, textAlign: 'center', color: "white", fontWeight: "600", marginTop: 10}}>{item.points.length}</Text>
//                 </View>
//             </MapboxGL.PointAnnotation>
//         )
//     }
// }
