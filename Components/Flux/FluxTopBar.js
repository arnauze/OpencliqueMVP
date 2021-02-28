import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { connect } from 'react-redux'
import { API } from 'aws-amplify';
import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../../aws-exports';
Amplify.configure(awsmobile);

class FluxTopBar extends React.Component {

    state = {
        stories: []
    }

    componentWillMount() {

        Storage.get(this.props.user.info.profile_picture, {level: 'public'})
        .then(result => {

            this.setState({
                ...this.state,
                connectedUserPicture: result
            })
            
        })

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/followings'
        let myInit = {
            body: this.props.user.info.friends
        }

        API.get(apiName, path, myInit)
        .then(followings => {

            console.log("Followings return:", followings)

            followings.map(item => {

                if (item.status.filter(item => item != 0).length > 0) {

                    var fullName = item.full_name
                    var profilePicturePath = item.profile_picture

                    Storage.get(profilePicturePath, {level: 'public'})
                    .then(result => {

                        this.setState({
                            ...this.state,
                            stories: [...this.state.stories, {
                                fullName: fullName,
                                url: result
                            }]
                        })

                    })

                }

            })


        })
        .catch(err => {

            console.log(err)

        })
            
    }

    _outputFriendsStory = () => {
        return (
            this.state.stories.map((item, index) => (
                    <View key={index} style={styles.box}>
                        <TouchableOpacity>
                            <Image
                            style={styles.profile_picture}
                            source={{url: item.url}}
                            />
                        </TouchableOpacity>
                        <Text>{item.fullName}</Text>
                    </View>
            ))
        )
    }

    render() {
        return (
            <ScrollView
            style={styles.main_container_properties}
            contentContainerStyle={styles.main_container_layout}
            horizontal
            >
                <View style={styles.box}>
                    <TouchableOpacity>
                        <Image
                        style={styles.profile_picture}
                        source={{url: this.state.connectedUserPicture}}
                        />
                    </TouchableOpacity>
                    <Text>Your story</Text>
                </View>
                {this._outputFriendsStory()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main_container_properties: {
        height: 80,
        margin: 3,
        borderBottomWidth: 0.5
    },
    main_container_layout: {
        alignItems: 'center'
    },
    profile_picture: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        backgroundColor: 'lightgray',
        margin: 5
    },
    text: {
        fontSize: 10,
        fontWeight: '100'
    },
    box: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }
}) 

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(FluxTopBar)