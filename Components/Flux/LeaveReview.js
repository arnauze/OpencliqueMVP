import React from 'react'
import { TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native'
import { findNearbyPlace } from '../../API/Places'
import { connect } from 'react-redux'

class LeaveReview extends React.Component {
    
    constructor(props) {
        super(props)

        places = []
        let location = this.props.user.currentLocation
        // For now navigator.geolocation doesn't work on mobile because I created the project with create-react-native-app

        // navigator.geolocation.getCurrentPosition(e => {
            findNearbyPlace({ latitude: location.latitude, longitude: location.longitude })
            .then(response => {
                response.results.map(item => {
                    places.push({
                        name: item.name,
                        id: item.place_id,
                        address: item.vicinity,
                        types: item.types
                    })
                })
                this.setState({
                    places: places
                })
            })
        // })
    }

    render() {
        if (this.state) {
            return (
                <ScrollView>
                    {
                    this.state.places.map((item, index) => (
                        <TouchableOpacity
                        key={index}
                        style={[styles.item, {marginTop: index == 0 ? 10 : 0}]}
                        onPress={() => {
                            this.props.navigation.navigate('ReviewPlace', { location: item })
                        }}
                        >
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.address}>{item.address}</Text>
                        </TouchableOpacity>
                    ))
                    }
                </ScrollView>
            )
        } else {
            return (
                <Text>Loading</Text>
            )
        }
    }
}

const styles = StyleSheet.create({
    address: {
        fontWeight: '100',
        marginBottom: 10
    },
    name: {
        fontWeight: 'bold'
    },
    item: {
        marginLeft: 10,
        marginBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray'
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(LeaveReview)