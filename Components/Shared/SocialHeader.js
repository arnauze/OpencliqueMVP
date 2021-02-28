import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { getBrackets, getBracketColor } from '../Functions/functions';
import { Storage } from 'aws-amplify'

class SocialHeader extends React.Component {

    state = {
        profilePicture: ''
    }

    async componentWillMount() {
        if (this.props.user.profile_picture) {
            let response = await Storage.get(this.props.user.profile_picture, {level: 'public'})
            this.setState({
                ...this.state,
                profilePicture: response
            })
        }
    }

    _goToUserPage = () => {
        if (this.props.connectedUser.info.username === this.props.user.username) {
            this.props.navigation.navigate('Profile')
        } else {
            this.props.navigation.navigate('FriendsProfile', { user: this.props.user })
        }
    }

    _actionType() {
        var type = this.props.item.flux_type.type
        if (type === 'review') {
            return 'left a review'
        } else if (type === 'location') {
            return 'shared his location'
        } else if (type === 'post') {
            return 'posted'
        } else if (type === 'event') {
            return 'created an event'
        } else if (type === 'booking') {
            return 'registered to an ' + this.props.item.flux_type.booking_type
        } else if (type === 'media') {
            return 'posted a new picture'
        } else if (type === 'status') {
            return 'posted on his wall'
        }
    }

    render() {

        return (

            <View style={styles.top_bar}>
                <TouchableOpacity
                style={styles.user_informations}
                onPress={() => this._goToUserPage()}
                >
                    <View>
                        <Image
                        source={{url: this.state.profilePicture}}
                        style={styles.profile_picture}
                        />
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Text style={{color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{this.props.user.full_name}</Text>
                        <Text style={{color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{getBrackets(this.props.user.cliquepoints)}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                    {this.props.inFlux ? <Text style={{fontWeight: '600'}}>{this._actionType()}</Text> : null}
                    <Text style={{fontSize: 10}}>{this.props.timeDifference.number} {this.props.timeDifference.timeframe} ago</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <TouchableOpacity>
                        <Text style={{fontSize: 10, margin: 2}}>ooo</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )

    }

}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: 'white',
        marginBottom: 5
    },
    top_bar: {
        flexDirection: 'row',
        flex: 1
    },
    user_informations: {
        flex: 2,
        flexDirection: 'row'
    },
    profile_picture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 0.5,
        margin: 5
    },
    rating_box: {
        margin: 10,
        alignItems: 'center'
    },
    rating_and_name: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        connectedUser: state.user
    }
}

export default connect(mapStateToProps)(SocialHeader)