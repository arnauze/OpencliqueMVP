import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class PlacesVisited extends React.Component {

    _outputVisitedPlaces() {
        return (
            this.props.user && this.props.user.places_visited ? this.props.user.places_visited.filter(item => item != 0).map((item, index) => {
                return (
                    <View key={index}>
                        <View style={{borderBottomWidth: 0.5, borderTopWidth: 0.5, justifyContent: 'center', alignItems: 'center', height: 25}}>
                            <Text style={{fontWeight: 'bold'}}>{item.country.name}</Text>
                        </View>
                        {item.country.cities.map((item, index) => {
                            return (
                                <Text key={index} style={{marginLeft: 7}}>{item}</Text>
                            )
                        })}
                    </View>
                )
            }) : null
        )
    }

    _numberOfVisitedCities() {
        var total = 0
        this.props.user && this.props.user.places_visited ? this.props.user.places_visited.filter(item => item != 0).map(item => {
            total += item.country.cities.length
        }) : null
        return total
    }

    _numberOfVisitedCountries() {
        if (this.props.user && this.props.user.places_visited) {
            return this.props.user.places_visited.filter(item => item != 0).length
        }
    }

    render() {
        console.log(this.props)
        return (
            <ScrollView>
                <View style={styles.top_bar_container}>
                    <View style={styles.text_container}>
                        <Text style={{fontWeight: 'bold'}}>Countries: {this._numberOfVisitedCountries()}</Text>
                    </View>
                    <View style={styles.text_container}>
                        <Text style={{fontWeight: 'bold'}}>Cities: {this._numberOfVisitedCities()}</Text>
                    </View>
                </View>
                {this._outputVisitedPlaces()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    top_bar_container: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center'
    },
    text_container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 5
    }
})

export default connect()(PlacesVisited)