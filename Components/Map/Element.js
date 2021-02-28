import React from 'react'
import { View, Text, StyleSheet, Switch } from 'react-native'
import { connect } from 'react-redux'
import { transformActionValue } from '../../Store/Reducers/handle_filters'

class Element extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.filters.indexOf(transformActionValue(this.props.text)) != -1 ? true : false
        }
    }

    async _changeValue() {
        if (this.state.value) {
            this.setState({
                ...this.state,
                value: false
            })
        }
        else {
            this.setState({
                ...this.state,
                value: true
            })
        }
        await this._changeFilter(this.props.text)

        // Not sure if I really need it
        // this.props.reload()
    }

    render() {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 5}}>
                <Switch 
                onValueChange={() => this._changeValue()}
                value={this.state.value}
                />
                <Text style={{color: 'white', margin: 5}}>{this.props.text}</Text>
            </View>
        )
    }

    _changeFilter(filterName) {
        let action = { type: 'CHANGE_FILTER', value: filterName }
        this.props.dispatch(action)
    }
}

const styles = StyleSheet.create({
    filter: {
        width: 100,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
        backgroundColor: 'lightgray',
        margin: 5
    },
    text: {
        alignSelf: 'center'
    }
})

const mapStateToProps = state => {
    return {
        filters: state.filters,
        currentLocation: state.currentLocation
    }
}

export default connect(mapStateToProps)(Element)