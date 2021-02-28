import React from 'react'
import { View, Text, ActivityIndicator, ImageBackground, TextInput, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import { appColor } from '../../../Styles/styles'
import PostButton from '../../Shared/PostButton'
import { connect } from 'react-redux'
import { API, Storage } from 'aws-amplify'
import earnedReward from '../../Functions/functions'

class PostImage extends React.Component {
    
    state = {
        loading: true
    }

    componentWillMount() {

        Storage.get(this.props.navigation.state.params.path)
        .then(response => {
            this.setState({
                ...this.props.navigation.state.params.state,
                updatable: this.props.navigation.state.params.updatable,
                image: response,
                loading: false
            })
        })
        .catch(err => {
            console.log(err)
        })

    }

    _addStatus = async (place) => {

        // Function called when the user chooses to add a post a new status

        var status = {}
        if (place.tags) {
            status = {
                action: "at",
                archived: false,
                creator: this.props.user.info.username,
                place: {
                    id: place.id,
                    name: place.tags.name,
                    type: place.tags.amenity
                },
                with: this.state.selected,
                description: this.state.description ? this.state.description : '.',
                medias: this.state.medias,
                id: (Date.now() + Math.random()).toString()
            }
        } else if (place.social) {
            status = {
                action: "at",
                archived: false,
                creator: this.props.user.info.username,
                place: {
                    id: place.id,
                    name: place.name,
                    type: "event"
                },
                with: this.state.selected,
                description: this.state.description ? this.state.description : '.',
                medias: this.state.medias,
                id: (Date.now() + Math.random()).toString()
            }
        } else {
            // User created place
            if (!place.name) {
                alert("You need to tell us the name of where you are")
                return ;
            }
            status = {
                action: "at",
                archived: false,
                creator: this.props.user.info.username,
                place: {
                    id: (Date.now() + Math.random()).toString(),
                    name: place.name,
                    type: "user_created",
                    coords: place.coords
                },
                with: this.state.selected,
                description: this.state.description ? this.state.description : '.',
                medias: this.state.medias,
                id: (Date.now() + Math.random()).toString()
            }
        }

        let apiName = 'Openclique'
        let path = '/status'
        let myInit = {
            body: {
                status: status,
                user: this.props.user.info,
                place: place
            }
        }

        let response = await API.post(apiName, path, myInit)
        var user = response.Item

        console.log("Successfully called the API!", response)

        let reward = earnedReward(user, "status")

        if (reward.cp > 0) {
            let apiName = 'Openclique'
            let path = '/achievements'
            let myInit = {
                body: {
                    reward: reward,
                    achievement: {
                        type: "status",
                        amount: user.status_total
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
        await this.props.dispatch(action)

        this.props.navigation.state.params.finishAddStatus()
        this.props.navigation.navigate('Map')

    }

    onInviteFriendsDone = friends => {

        this.setState({
            ...this.state,
            selected: friends
        })

    }

    render() {

        console.log("[POST IMAGE] state: ", this.state)

        if (this.state.loading) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )
        } else {
            return (
                <ImageBackground
                style={{flex: 1}}
                imageStyle={{flex: 1, width: '100%', height: '100%'}}
                source={{uri: this.state.image}}
                >
                    <SafeAreaView style={{flex: 1}}>
                        <View style={{flex: 8}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                                <View style={{flex: 1}}></View>
                                <View style={{flex: 1, alignItems: 'center', margin: 7, backgroundColor: 'rgba(0,0,0,0.3)'}}>
                                    <TextInput
                                    editable={this.state.updatable}
                                    placeholder='Where are you ?'
                                    value={this.state.clicked.tags ? this.state.clicked.tags.name : this.state.clicked.name}
                                    onChangeText={text => this.setState({...this.state, clicked: { ...this.state.clicked, name: text }})}
                                    style={{color: 'white'}}
                                    />
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 7}}>
                                    <TouchableOpacity
                                    style={{width: 40, height: 40, borderRadius: 20, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center'}}
                                    onPress={() => this.props.navigation.navigate('InviteFriends', { friends: this.state.friends, selectUser: this._handleUserSelected, onDone: this.onInviteFriendsDone })}
                                    >
                                        <Image source={require('../../../Images/add_people_status.png')} style={{width: 24, height: 13}}/>
                                    </TouchableOpacity>
                                    <Text style={{color: 'white'}}>(+10/p)</Text>
                                </View>
                            </View>
                            {
                                this.state.selected.length > 0 ? 
                                    <View style={{alignSelf: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)'}}>
                                        <Text style={{color: 'white'}}>with</Text>
                                        {
                                            this.state.selected.map((item, index) => (
                                            <Text key={index} style={{color: 'white'}}>{item.username}</Text>
                                        ))
                                        }
                                    </View>
                                :
                                    null
                            }
                            <TextInput
                            placeholder='Add a description...'
                            style={{alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white'}}
                            value={this.state.description}
                            onChangeText={text => this.setState({...this.state, description: text})}
                            />
                        </View>
                        <View style={{alignItems: 'center', flex: 2, justifyContent: 'flex-end'}}>
                            <PostButton
                            width={120}
                            height={40}
                            text="Post"
                            backgroundColor={appColor}
                            borderRadius={5}
                            onPress={() => this._addStatus(this.state.clicked)}
                            />
                            <TouchableOpacity
                            style={{marginTop: 5}}
                            onPress={() => this.props.navigation.goBack()}
                            >
                                <Text style={{color: 'white'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </ImageBackground>
            )
    
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(PostImage)