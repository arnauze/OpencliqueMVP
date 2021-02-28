import React from 'react'
import { connect } from 'react-redux'
import {  Text, TouchableOpacity, View, Image } from 'react-native'
import { appColor } from '../../Styles/styles';

class BottomNavigationText extends React.Component {

    _dispatchAction() {
        let action = { type: 'CHANGE_OPEN_TAB', value: this.props.text }
        this.props.dispatch(action)
    }

    getSource = () => {

        if (this.props.text === 'Wall') {
            if (this.props.openTab === this.props.text) {
                return require('../../Images/Profile/wall.red.png')
            } else {
                return require('../../Images/Profile/wall.black.png')
            }
        } else if (this.props.text === 'Reviews') {
            if (this.props.openTab === this.props.text) {
                return require('../../Images/Profile/star.red.png')
            } else {
                return require('../../Images/Profile/star.black.png')
            }
        } else if (this.props.text === 'Photos') {
            if (this.props.openTab === this.props.text) {
                return require('../../Images/Profile/photos.red.png')
            } else {
                return require('../../Images/Profile/photos.black.png')
            }
        }

    }

    getStyle = () => {

        if (this.props.text === 'Wall') {
           return {width: 19, height: 18, marginRight: 6}
        } else if (this.props.text === 'Reviews') {
            return {width: 18, height: 17.2, marginRight: 6}
        } else if (this.props.text === 'Photos') {
            return {width: 18, height: 20, marginRight: 6}
        }

    }

    render() {
        return (
            <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}
            onPress={() => this._dispatchAction()}
            >
                <Image source={this.getSource()} style={this.getStyle()}/>
                {
                    this.props.notifications > 0 ?
                        <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white'}}>{this.props.notifications}</Text>
                        </View>
                    :
                        null
                }
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = state => {
    return {
        filters: state.filters,
        openMenu: state.openMenu,
        openFilter: state.openFilter,
        openTab: state.openTab
    }
}

export default connect(mapStateToProps)(BottomNavigationText)