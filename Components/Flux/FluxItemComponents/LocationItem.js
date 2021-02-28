import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE, Marker } from 'react-native-maps'

export default class LocationItem extends React.Component {
    render() {
        
        const region = {
            latitude: this.props.item.flux_type.location.location.lat,
            longitude: this.props.item.flux_type.location.location.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
        }

        return (
            <View>
                {this.props.item.flux_type.comment === 'No comment' ? null : <Text style={{margin: 10, fontWeight: '400'}}>{this.props.item.flux_type.comment}</Text>}
                <View style={styles.container}>
                    <MapView
                    scrollEnabled={false}
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    initialRegion={region}
                    >
                        <Marker
                        coordinate={{latitude: this.props.item.flux_type.location.location.lat, longitude: this.props.item.flux_type.location.location.lng}}
                        />
                    </MapView>
                </View>
                <View style={styles.place_information}>
                    <Text style={{fontWeight: '600'}}>{this.props.item.flux_type.location.name}</Text>
                    <Text style={{fontWeight: '200'}}>{this.props.item.flux_type.location.address}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 150
    },
    place_information: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray'
    },
    map: {
      flex: 1
    }
  });
