import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default class Header extends React.Component {
    render() {
        return (
            <View style={{backgroundColor: 'white', borderBottomWidth: 0.5}}>
                <View style={[styles.container, { borderBottomWidth: 0.5, borderBottomColor: 'lightgray', marginTop: 10 }]}>
                    <TouchableOpacity
                    onPress={() => this.props.changeTimeframe('Overall')}
                    >
                        <Text style={[styles.text, { color: this.props.filterState.timeframe === 'Overall' ? '#F2994A' : 'black' }]}>Overall</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeTimeframe('Month')}
                    >
                        <Text style={[styles.text, { color: this.props.filterState.timeframe === 'Month' ? '#F2994A' : 'black' }]}>Month</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeTimeframe('Week')}
                    >
                        <Text style={[styles.text, { color: this.props.filterState.timeframe === 'Week' ? '#F2994A' : 'black' }]}>Week</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <TouchableOpacity
                    onPress={() => this.props.changeLocation('World')}
                    >
                        <Text style={{color: this.props.filterState.location === 'World' ? '#F2994A' : 'black'}}>World</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeLocation('Following')}
                    >
                        <Text style={{color: this.props.filterState.location === 'Following' ? '#F2994A' : 'black'}}>Following</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeLocation('Your city')}
                    >
                        <Text style={{color: this.props.filterState.location === 'Your city' ? '#F2994A' : 'black'}}>Your city</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeLocation('State')}
                    >
                        <Text style={{color: this.props.filterState.location === 'State' ? '#F2994A' : 'black'}}>State</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => this.props.changeLocation('Country')}
                    >
                        <Text style={{color: this.props.filterState.location === 'Country' ? '#F2994A' : 'black'}}>Country</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    text: {
        marginBottom: 10
    }
})