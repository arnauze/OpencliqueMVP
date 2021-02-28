import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import earnedReward from '../Functions/functions'

class SearchItem extends React.Component {

    _handleFollows = async () => {
        let apiName = 'Openclique'
        let path = '/users/' + this.props.connected_user.username + '/followings/' + this.props.item.username

        if (!this._isAlreadyFollowed()) {
            let myInit = {
                queryStringParameters: {
                    user_added: this.props.item.username,
                    adding_user: this.props.connected_user.username
                }
            }

            await API.post(apiName, path, myInit)

            var user = {
                ...this.props.connected_user,
                followings: [...this.props.connected_user.followings, this.props.item.username]
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
                        username: this.props.item.username
                    }
                }}
                this.props.dispatch(action)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    _isAlreadyFollowed() {
        return (this.props.user.info.friends.indexOf(this.props.item.username) >= 0)
    }

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 5}}>
                <TouchableOpacity
                onPress={() => this.props.navigation.navigate('FriendsProfile', {user: this.props.item})}
                style={{justifyContent: 'center', alignItems: 'center'}}
                >
                    <Text style={{fontWeight: '600'}}>{this.props.item.full_name}</Text>
                    <Text>@{this.props.item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => this._handleFollows()}
                style={[styles.follow_button, {backgroundColor: this._isAlreadyFollowed() ? 'lightblue' : 'white'}]}
                >
                    <Text>{this._isAlreadyFollowed() ? 'Followed' : 'Follow'}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    follow_button: {
        width: 75,
        height: 30,
        borderRadius: 25,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SearchItem)