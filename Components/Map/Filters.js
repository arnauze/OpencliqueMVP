import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import Element from './Element'
import { connect } from 'react-redux'

class Filters extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: ['Restaurants', 'Open', 'Hotels', 'Gym', 'Events']
        }
    }

    _openFilter() {
        let action = { type: 'CHANGE_OPEN_FILTER', value: this.props.openFilter }
        this.props.dispatch(action)
    }

    _diplayFilters() {
        if (this.props.openFilter) {
            return (
                <View style={styles.open_filter}>
                    {this.state.filters.map((item, index) => (
                    <Element key={index} text={item} reload={this.props.reload}/>
                    ))}
                </View>
            )
        } else {
            return (
                <TouchableOpacity
                style={styles.filter_button}
                onPress={() => this._openFilter()}
                >
                    <Image source={require('../../Images/filters.png')} />
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this._diplayFilters()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'column',
        position: 'absolute',
        top: 10,
        left: 10
    },
    filter_button: {
        margin: 5
    },
    open_filter: {
        position: 'absolute',
        top: 40,
        borderWidth: 0.5,
        backgroundColor: '#333333',
        borderRadius: 10
    }
})

const mapStateToProps = state => {
    return {
        filters: state.filters,
        openMenu: state.openMenu,
        openFilter: state.openFilter
    }
}

export default connect(mapStateToProps)(Filters)