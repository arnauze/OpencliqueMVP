import React from 'react'
import { Image, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import MapComponents from './MapComponents'

export default class EventCreation extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            region: {
                latitude: 34.053901,
                longitude: -118.201739,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            marker_coordinate: {
                latitude: 34.053901,
                longitude: -118.201739
            },
            update: false
        }
    }

    _changePosition(coords) {
        this.setState({
            ...this.state,
            region: {
                ...this.state.region,
                latitude: coords.lat,
                longitude: coords.lng
            },
            marker_coordinate: {
                latitude: coords.lat,
                longitude: coords.lng
            },
            update: true
        }, () => this.setState({...this.state, update: false}))
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                initialRegion={this.state.region}
                region={this.state.update ? this.state.region : null}
                onRegionChangeComplete={region => {
                    this.setState({
                        ...this.state,
                        marker_coordinate: region
                    })
                }}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                >
                    <Marker
                    coordinate={this.state.marker_coordinate}
                    >
                        <Image
                        source={require('../../Images/location.png')}
                        style={{ width: 22, height: 40 }} />
                    </Marker>
                </MapView>
                <MapComponents
                navigation={this.props.navigation}
                marker_coordinate={this.state.marker_coordinate}
                changePosition={this._changePosition.bind(this)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    text_input: {
        width: 275,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(127, 127, 127, 0.7)',
        position: 'absolute',
        top: 10,
        borderWidth: 0.5
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 50
    },
    confirm_button: {
        width: 200,
        height: 50,
        backgroundColor: 'rgba(127, 127, 127, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        borderRadius: 20,
        borderWidth: 0.5
    },
    go_back_text: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        fontWeight: 'bold'
    }
  });