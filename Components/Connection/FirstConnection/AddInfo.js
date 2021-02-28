import React from 'react'
import { SafeAreaView, ScrollView, Text, TextInput, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import Navigation from '../../../Navigation/Navigation'
import { API } from 'aws-amplify'
import { readFile } from '../../Functions/functions'

import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../../../aws-exports';
Amplify.configure(awsmobile);

class AddInfo extends React.Component {

    state = {
        first_name: '',
        last_name: '',
        confirmed: false
    }

    _updateInformationsAndGoToMap() {
        let apiName = 'Openclique';
        let path = '/users/' + this.props.user.info.username
        let myInit = {
            body: {
                "first_name": this.state.first_name,
                "last_name": this.state.last_name,
                "full_name": this.state.first_name + ' ' + this.state.last_name
            },
            queryStringParameters: {
                "first_connection": true
            }
        }

        API.post(apiName, path, myInit).then(response => {
            let action = {type: 'UPDATE_USER', value: {
                name: {
                    "first_name": this.state.first_name,
                    "last_name": this.state.last_name,
                    "full_name": this.state.first_name + ' ' + this.state.last_name
                }
            }}
            this.props.dispatch(action)
            this.setState({
                ...this.state,
                confirmed: true
            })
        }).catch(error => {
            console.log(error)
        });
    }

    _chooseProfilePicture() {
        ImagePicker.showImagePicker({}, response => {

            var randomId = (Date.now() + Math.random()).toString()
            var key = this.props.user.info.username + '/' + randomId
            user = this.props.user

            this.setState({
                profilePicture: response.uri
            })
        
            readFile(response.origURL).then(buffer => {
                Storage.put(key, buffer, {
                    contentType: response.type,
                    level: 'private'
                }).then(response => {

                    let apiName = 'Openclique'
                    let path = '/users/' + user.info.username + '/medias/' + randomId + '/profile_picture'
                    let myInit = {
                        queryStringParameters: {
                            add: true
                        }
                    }

                    API.post(apiName, path, myInit)
                    .then(response => {
                        console.log(response)
                    }).catch(error => {
                        console.log(error)
                    });
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e);
            });
        })
    }

    render() {
        if (!this.state.confirmed) {
            return (
                <SafeAreaView style={styles.main_container}>
                    <View style={{marginTop: 30, marginBottom: 10, borderWidth: 0.5, width: '95%'}}>
                        <Text style={{fontSize: 15, fontWeight: 'bold', textAlign: 'center', margin: 5}}>
                            We need you to enter some more informations.
                        </Text>
                        <Text style={{fontSize: 15, fontWeight: 'bold', textAlign: 'center', margin: 5}}>
                            You only need to do it once and then you're ready to go.
                        </Text>
                    </View>
                    <ScrollView
                    style={{width: '100%'}}
                    >
                        <View style={styles.informations_box}>
                            <View style={{marginTop: 10, marginBottom: 50, borderBottomWidth: 0.5}}>
                                <Text style={{ marginBottom: 15, fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>First name:</Text>
                                <TextInput
                                style={styles.text_input}
                                placeholder='Kelly'
                                onChangeText={text => {
                                    this.setState({
                                        ...this.state,
                                        first_name: text
                                    })
                                }}
                                />
                            </View>
                            <View style={{marginBottom: 50, borderBottomWidth: 0.5}}>
                                <Text style={{ marginBottom: 15, fontSize: 18, fontWeight: 'bold', alignSelf: 'center' }}>Last name:</Text>
                                <TextInput
                                style={styles.text_input}
                                placeholder='Perez'
                                onChangeText={text => {
                                    this.setState({
                                        ...this.state,
                                        last_name: text
                                    })
                                }}
                                />
                            </View>
                            <View style={styles.profile_picture_container}>
                                <Text style={{ marginBottom: 15, fontSize: 18, fontWeight: 'bold' }}>Add a profile picture:</Text>
                                <TouchableOpacity
                                style={{width: 125, height: 125, borderRadius: 62.5}}
                                onPress={() => this._chooseProfilePicture()}
                                >
                                    <Image style={{width: 125, height: 125, borderRadius: 62.5, borderWidth: 0.5, backgroundColor: 'white'}} source={{uri: this.state && this.state.profilePicture ? this.state.profilePicture : 'test'}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                        style={styles.button}
                        onPress={() => this._updateInformationsAndGoToMap()}
                        >
                            <Text>Confirm</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            )
        }
        else {
            return (
                <Navigation />
            )
        }
    }
}

const styles = StyleSheet.create({
    main_container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'lightgray'
    },
    informations_box: {
        alignItems: 'center',
        marginTop: 10
    },
    text_input: {
        fontSize: 18,
        marginBottom: 5,
        textAlign: 'center'
    },
    box: {
        width: 125,
        height: 125,
        borderRadius: 100,
        borderWidth: 0.5,
        backgroundColor: 'white'
    },
    profile_picture_container: {
        alignItems: 'center'
    },
    button: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.5,
        marginTop: 50,
        backgroundColor: '#FEA35D'
    },
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AddInfo)