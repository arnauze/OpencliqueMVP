import React from 'react'
import { Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import Geocoder from 'react-native-geocoder'

export default class MapComponents extends React.Component {

    _getLatLong(text) {
        Geocoder.geocodeAddress(text)
        .then(res => {
            this.props.changePosition(res[0].position)
        })
        .catch(err => console.log(err))
    }

    render() {
        return (
            <React.Fragment>
                <TextInput
                style={styles.text_input}
                onSubmitEditing={e => this._getLatLong(e.nativeEvent.text)}
                placeholder='Search...'
                />
                <Text
                style={styles.text}
                >
                Pick your location
                </Text>
                <TouchableOpacity 
                style={styles.confirm_button}
                onPress={() => this.props.navigation.navigate('CreateEvent', {marker_coordinate: this.props.marker_coordinate})}
                >
                    <Text style={{fontWeight: 'bold'}}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                >
                    <Text style={styles.go_back_text}>Go back</Text>
                </TouchableOpacity>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    text_input: {
        width: 275,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(127, 127, 127, 0.7)',
        position: 'absolute',
        top: 10,
        borderWidth: 0.5,
        textAlign: 'center'
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