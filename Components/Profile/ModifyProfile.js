import React from 'react'
import { TextInput, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'
import { readFile } from '../Functions/functions'
import { API, Storage } from 'aws-amplify';

class ModifyProfile extends React.Component {

    state = {
        user: this.props.navigation.state.params.user,
        starting_bio_text: this.props.navigation.state.params.user.bio,
        bio: '',
        first_name: '',
        last_name: ''
    }

    componentWillMount() {
        if (this.props.user.info.profile_picture) {
            Storage.get(this.props.user.info.profile_picture, {level: 'public'})
            .then(result => {

                this.setState({
                    profilePicture: {
                        url: result
                    }
                })
                
            })
            .catch(err => console.log(err));
            }
    }

    async _editProfile() {
        
        let apiName = 'Openclique'
        let path = '/users/' + this.props.navigation.state.params.user.username

        if (this.state.bio.length > 0) {

            // If there is a text for bio then I update the user's bio

            var myInit = {
                queryStringParameters: {
                    bio: this.state.bio
                }
            }

            await API.post(apiName, path, myInit)
            .then(response => {
                console.log(response)
                let action = {
                    type: 'UPDATE_USER',
                    value: {
                        bio: this.state.bio
                    }
                }
                this.props.dispatch(action)
            })
            .catch(error => {
                console.log(error)
            })

        }

        if (this.state.first_name.length > 0 || this.state.last_name.length > 0) {

            // If there is a text for first name or last name then I update the user's name

            var first_name = this.state.first_name.length > 0 ? this.state.first_name : this.props.navigation.state.params.user.first_name
            var last_name = this.state.last_name.length > 0 ? this.state.last_name : this.props.navigation.state.params.user.last_name

            myInit = {
                queryStringParameters: {
                    name: true
                },
                body: {
                    first_name: first_name,
                    last_name: last_name,
                    full_name: first_name + ' ' + last_name
                }
            }

            await API.post(apiName, path, myInit)
            .then(response => {
                console.log(response)
                let action = {
                    type: 'UPDATE_USER',
                    value: {
                        name: {
                            first_name: first_name,
                            last_name: last_name,
                            full_name: first_name + ' ' + last_name
                        }
                    }
                }
                this.props.dispatch(action)
            })
            .catch(error => {
                console.log(error)
            })
        }

        if (this.state.profilePicture) {

            // If the user picked a new profile picture

            var randomId = (Date.now() + Math.random()).toString()
            var key = this.props.user.info.username + '/' + randomId

            readFile(this.state.profilePicture.url).then(buffer => {
                Storage.put(key, buffer, {
                    contentType: this.state.profilePicture.type,
                    level: 'public'
                }).then(response => {

                    console.log("Adding the new profile picture:", response)

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
        }

        this.props.navigation.goBack()
    }

    _pickNewProfilePicture() {
        ImagePicker.showImagePicker({}, response => {
            if (!response.didCancel) {

                var randomId = (Date.now() + Math.random()).toString()
                var key = this.props.user.info.username + '/' + randomId
                user = this.props.user

                this.setState({
                    ...this.state,
                    profilePicture: {
                        uri: response.uri,
                        name: response.fileName,
                        height: response.height,
                        width: response.width,
                        type: response.type,
                        url: response.origURL
                    }
                })

            }
        })
    }

    _outputImage() {
        if (this.state && this.state.profilePicture && this.state.profilePicture.uri) {
            return (
                <Image
                source={{uri: this.state.profilePicture.uri}}
                style={{height: 200, width: 200, borderRadius: 100, backgroundColor: 'white', borderWidth: 0.5}}
                />
            )
        } else if (this.state && this.state.profilePicture && this.state.profilePicture.url) {
            return (
                <Image
                source={{url: this.state.profilePicture.url}}
                style={{height: 200, width: 200, borderRadius: 100, backgroundColor: 'white', borderWidth: 0.5}}
                />
            )
        } else {
            return (
                <Image
                style={{height: 200, width: 200, borderRadius: 100, backgroundColor: 'white', borderWidth: 0.5}}
                />
            )
        }
    }

    render() {
        console.log(this.state)
        return (
            <KeyboardAwareScrollView contentContainerStyle={styles.main_container}>
                <Text style={styles.bio_title}>Profile picture:</Text>
                <TouchableOpacity
                onPress={() => this._pickNewProfilePicture()}
                >
                    {this._outputImage()}
                </TouchableOpacity>
                <Text style={styles.bio_title}>Bio:</Text>
                <View style={styles.bio_box}>
                    <TextInput
                    multiline
                    style={styles.text_input}
                    placeholder={this.state.starting_bio_text}
                    value={this.state.text}
                    onChangeText={text => {
                        this.setState({
                            ...this.state,
                            bio: text
                        })
                    }}
                    />
                </View>
                <Text style={styles.bio_title}>First name:</Text>
                <View style={styles.name_box}>
                    <TextInput
                    style={styles.text_input}
                    placeholder={this.props.navigation.state.params.user.first_name}
                    value={this.state.text}
                    onChangeText={text => {
                        this.setState({
                            ...this.state,
                            first_name: text
                        })
                    }}
                    />
                </View>
                <Text style={styles.bio_title}>Last name:</Text>
                <View style={styles.name_box}>
                    <TextInput
                    style={styles.text_input}
                    placeholder={this.props.navigation.state.params.user.last_name}
                    value={this.state.text}
                    onChangeText={text => {
                        this.setState({
                            ...this.state,
                            last_name: text
                        })
                    }}
                    />
                </View>
                <TouchableOpacity
                onPress={() => this._editProfile()}
                style={styles.button}
                >
                    <Text>Confirm</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        alignItems: 'center'
    },
    bio_title: {
        margin: 10,
        fontWeight: '500',
        fontSize: 16
    },
    bio_box: {
        minHeight: 75,
        width: '80%',
        borderWidth: 0.5,
        backgroundColor: 'white'
    },
    name_box: {
        minHeight: 40,
        width: '80%',
        borderWidth: 0.5,
        backgroundColor: 'white'
    },
    button: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.5,
        marginTop: 25,
        backgroundColor: '#FEA35D'
    },
    text_input: {
        flex: 1,
        margin: 5
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ModifyProfile)