import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import RoundedButton from './RoundedButton'
import { appColor } from '../../Styles/styles';
import { connect } from 'react-redux'
import { API } from 'aws-amplify'
import earnedReward, { getBrackets, getBracketColor } from '../Functions/functions'

const icons = [
    {
        text: 'Boutique',
        color: '#000000',
        icon: '../../Images/boutique.png'
    },
    {
        text: 'Achievements',
        color: '#000000',
        icon: '../../Images/achievements.png'
    }
]

class ProfileButtons extends React.Component {

    _isFollowed = () => {
        if ((this.props.connectedUser.info.followings.indexOf(this.props.user.username) >= 0) || (this.props.user.username === this.props.connectedUser.info.username)) {
            return true
        } else {
            return false
        }
    }

    _handleFollows = async () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.connectedUser.info.username + '/followings/' + this.props.user.username

        if (!this._isFollowed()) {

            let myInit = {
                queryStringParameters: {
                    user_added: this.props.user.username,
                    adding_user: this.props.connectedUser.info.username
                }
            }

            await API.post(apiName, path, myInit)
            var user = {
                ...this.props.connectedUser.info,
                followings: [...this.props.connectedUser.info.followings, this.props.user.username]
            }

            let reward = earnedReward(user, "follow1")

            if (reward.cp > 0) {
                let apiName = 'Openclique'
                let path = '/achievements'
                let myInit = {
                    body: {
                        reward: reward,
                        achievement: {
                            type: "follow1",
                            amount: user.followings.length
                        },
                        user_id: user.username
                    }
                }

                user = await API.post(apiName, path, myInit)
                reward = earnedReward(user, "achievement")
                if (reward.cp > 0) {
                    let apiName = 'Openclique'
                    let path = '/achievements'
                    let myInit = {
                        body: {
                            reward: reward,
                            achievement: {
                                type: "achievement",
                                amount: user.achievements.length
                            },
                            user_id: user.username
                        }
                    }
                    user = await API.post(apiName, path, myInit)
                }
            }

            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: user
                }
            }
            this.props.dispatch(action)

        } else {

            let myInit = {}

            API.del(apiName, path, myInit)
            .then(response => {
                let action = {type: 'UPDATE_USER', value: {
                    followings: {
                        action: 'REMOVE_FOLLOWING',
                        username: this.props.user.username
                    }
                }}
                this.props.dispatch(action)
            })
            .catch(error => {
                console.log(error)
            })

        }
    }

    boutiqueNotifications = () => {
        return this.props.connectedUser.info.items.pending.length
    }

    render() {

        if (this.props.profileType === 'Friend') {

            return (

                <View style={styles.main_container}>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('FollowersPage', { user: this.props.user } )}
                    >
                        <Text style={{fontWeight: '600'}}>Followers</Text>
                        <Text style={{fontWeight: '600', color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{this.props.user.followers.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('FollowersPage', { user: this.props.user } )}
                    >
                        <Text style={{fontWeight: '600'}}>Followings</Text>
                        <Text style={{fontWeight: '600', color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{this.props.user.followings.length}</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1}}>
                        <Text style={{color: getBracketColor(getBrackets(this.props.connectedUser.info.cliquepoints))}}>{getBrackets(this.props.user.cliquepoints)}</Text>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                        style={{width: 109, height: 27, justifyContent: 'center', alignItems: 'center', backgroundColor: appColor, borderRadius: 5}}
                        onPress={() => this._handleFollows()}
                        >
                            <Text style={{color: 'white', fontWeight: '500'}}>{this._isFollowed() ? 'Unfollow' : 'Follow'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{width: 79, height: 27, justifyContent: 'center', alignItems: 'center', borderRadius: 5, borderWidth: 0.5}}>
                            <Text>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            )

        } else {

            return (

                <View style={styles.main_container}>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('FollowersPage', { user: this.props.user } )}
                    >
                        <Text style={{fontWeight: '600'}}>Followers</Text>
                        <Text style={{fontWeight: '600', color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{this.props.user.followers.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('FollowersPage', { user: this.props.user } )}
                    >
                        <Text style={{fontWeight: '600'}}>Followings</Text>
                        <Text style={{fontWeight: '600', color: getBracketColor(getBrackets(this.props.user.cliquepoints))}}>{this.props.user.followings.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('Boutique', {user: this.props.user})}
                    >
                        <View style={{flexDirection: 'row', position: 'relative'}}>
                            <Image
                            source={require("../../Images/boutique.png")}
                            style={{width: 20, height: 19}}
                            />
                            {
                                this.boutiqueNotifications() > 0
                                ?
                                    <View style={{width: 15, height: 15, borderRadius: 7.5, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -9, right: -7}}>
                                        <Text style={{color: 'white'}}>{this.boutiqueNotifications()}</Text>
                                    </View>
                                :
                                    null
                            }
                        </View>
                        <Text style={{fontWeight: '600'}}>{icons[0].text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.props.navigation.navigate('Achievements')}
                    >
                        <Image
                        source={require("../../Images/achievements.png")}
                        style={{width: 21, height: 14}}
                        />
                        <Text style={{fontWeight: '600'}}>{icons[1].text}</Text>
                    </TouchableOpacity>
                </View>

            )

        }

    }

}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'column',
        flex: 5,
        alignItems: 'center'
    },
    container: {
        flex: 1
    }
})

const mapStateToProps = state => {
    return {
        connectedUser: state.user
    }
}

export default connect(mapStateToProps)(ProfileButtons);