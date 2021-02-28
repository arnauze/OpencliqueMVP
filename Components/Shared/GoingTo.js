import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class GoingTo extends React.Component {

    state = {
        menuOpen: false,
        updated: false,
        selected: {
            when: 'today',
            who: []
        },
        there: false
    }

    _updateMenu = () => {
        this.setState({
            ...this.state,
            menuOpen: this.state.menuOpen ? false : true,
            updated: false
        })
    }

    _confirmUpdates = () => {
        this.setState({
            ...this.state,
            menuOpen: false,
            updated: true
        })
    }

    _outputSelected = (str) => {
        if (str === 'alone') {

            if (this.state.selected.who.length === 0) {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>V</Text>
                    </View>
                )
            } else {
                return null
            }

        } else if (str === 'today') {

            if (this.state.selected.when === 'today') {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>V</Text>
                    </View>
                )
            } else {
                return null
            }

        } else if (str === 'another day...') {
            if (this.state.selected.when === 'another day...') {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>V</Text>
                    </View>
                )
            } else {
                return null
            }
        } else {
            if (this.state.selected.who.length !== 0) {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>V</Text>
                    </View>
                )
            } else {
                return null
            }
        }
    }

    _outputGoingWith = () => {
        if (this.state.selected.who.length !== 0) {
            return (
                <View style={{flexDirection: 'row'}}>
                    <Text>with </Text>
                    {this.state.selected.who.map((item, index) => {
                        return (
                            <Text key={index} style={{color: 'orange'}}>{item} </Text>
                        )
                    })}
                </View>
            )
        } else {
            return null
        }
    }

    _outputMenu = () => {
        if (this.state.menuOpen) {
            return (

                // Left part of the menu

                <View style={{top: -10, width: '95%', backgroundColor: '#F9F9F9', alignSelf: 'center', borderRadius: 5, borderWidth: 0.5, flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 1, height: 240, justifyContent: 'space-evenly'}}>
                        <TouchableOpacity style={{height: 80, justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 5}}
                        onPress={() => this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                who: []
                            }
                        })}
                        >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>alone</Text>
                        </View>
                            {this._outputSelected('alone')}
                        </TouchableOpacity>

                        <View style={{height: 0.5, backgroundColor: 'black', width: '90%', alignSelf: 'center'}}/>

                        <TouchableOpacity style={{height: 80, justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 5}}
                        onPress={() => this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                when: 'today'
                            }
                        })}
                        >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>today</Text>
                        </View>
                            {this._outputSelected('today')}
                        </TouchableOpacity>

                        <View style={{height: 0.5, backgroundColor: 'black', width: '90%', alignSelf: 'center'}}/>

                        <TouchableOpacity style={{height: 80, justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 5}}
                        onPress={() => this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                when: 'another day...'
                            }
                        })}
                        >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text>another day...</Text>
                        </View>
                            {this._outputSelected('another day...')}
                        </TouchableOpacity>
                    </View>

                    {/* Horizontal separator */}

                    <View style={{height: '90%', width: 0.5, backgroundColor: 'black'}}></View>

                    {/* Right part of the menu */}

                    <View style={{flex: 3, height: 240}}>
                        <TouchableOpacity
                        onPress={() => this._confirmUpdates()}
                        >
                            <Text style={{position: 'absolute', top: 8, right: 8, color: '#F05463', fontWeight: 'bold'}}>OK</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{height: 50, width: 50, backgroundColor: 'black', alignSelf: 'center'}}
                        onPress={() => this.setState({
                            ...this.state,
                            selected: {
                                ...this.state.selected,
                                who: ['Arnaud Magnan']
                            }
                        })}
                        >
                        </TouchableOpacity>

                        {this._outputGoingWith()}
                    </View>
                    
                </View>
            )
        } else {
            return null
        }
    }

    render() {
        console.log(this.state)
        return (
            <React.Fragment>
                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20}}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: this.state.updated ? '#F9F9F9' : '#F3780C'}]}
                    onPress={() => this._updateMenu()}
                    >
                        {
                            this.state.updated ? 
                            this.state.selected.who.length > 0 ?
                            <Text style={{color: '#F3780C', margin: 5}}>I'm going with {this.state.selected.who.length} people</Text>
                            :
                            <Text style={{color: '#F3780C', margin: 5}}>I'm going alone</Text>
                            :
                            <Text style={{color: 'white', margin: 5}}>I'm going...</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, {backgroundColor: this.state.there ? '#F9F9F9' : '#F3780C'}]}
                    onPress={() => this.setState({
                        ...this.state,
                        there: this.state.there ? false : true
                    })}
                    >
                        <Text style={{color: this.state.there ? '#F3780C' : 'white', margin: 5}}>I'm there</Text>
                    </TouchableOpacity>
                </View>
                {this._outputMenu()}
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#F3780C'
    }
})