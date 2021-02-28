import React from 'react'
import { View, Image, TouchableOpacity, StyleSheet} from 'react-native'
import { connect } from 'react-redux'

class SearchIcon extends React.Component {

    _changeSearchOnMap = () => {
        let action = {
            type: 'CHANGE_SEARCH',
            value: this.props.openSearch
        }
        this.props.dispatch(action)
    }

    render() {
        return (
            <TouchableOpacity
            onPress={() => this._changeSearchOnMap()}
            >
                <Image
                style={styles.main_container}
                source={require('../../Images/searchIcon.png')}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        width: 25,
        height: 25,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        openSearch: state.openSearch
    }
}

export default connect(mapStateToProps)(SearchIcon)