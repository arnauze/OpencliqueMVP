import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import OpenMenu from './OpenMenu'
import { connect } from 'react-redux'

class Menu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            openMenu: false
        }
    }

    _sendAction() {
        let action = { type: 'CHANGE_OPEN_MENU', value: this.props.openMenu }
        this.props.dispatch(action)
    }

    _displayMenu() {
        if (this.props.openMenu) {
            return (
                <OpenMenu navigation={this.props.navigation} userKey={this.props.userKey}/>
            )
        }
        else {
            return (
                <TouchableOpacity
                style={styles.main_container}
                onPress={() => this._sendAction()}
                >
                     <Image source={require('../../Images/menu.png')}/>
                </TouchableOpacity>
            )
        }
    }

    render() {

        console.log(this.props.userKey)
        
        return (
            this._displayMenu()
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        width: 60,
        position: 'absolute',
        bottom: 10,
        height: 50,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
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

export default connect(mapStateToProps)(Menu)