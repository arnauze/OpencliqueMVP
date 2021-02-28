import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import Header from './Header'
import Sections from './Sections'

export default class Leaderboard extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            timeframe: 'Overall',
            location: 'World'
        }

        this._changeTimeframe = this._changeTimeframe.bind(this)
        this._changeLocation = this._changeLocation.bind(this)
    }

    _changeTimeframe(text) {
        this.setState({
            ...this.state,
            timeframe: text
        })
    }

    _changeLocation(text) {
        this.setState({
            ...this.state,
            location: text
        })
    }

    render() {
        return (
            <ScrollView
            stickyHeaderIndices={[0]}
            >
                <Header
                changeTimeframe={this._changeTimeframe}
                changeLocation={this._changeLocation}
                filterState={this.state}
                />
                <Sections />
            </ScrollView>
        )
    }
}