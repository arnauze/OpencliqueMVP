import React from 'react'
import { Image, TextInput, StyleSheet, TouchableOpacity, View, Text, KeyboardAvoidingView, SafeAreaView, ActivityIndicator} from 'react-native'
import { connect } from 'react-redux'
import { Auth, API, Storage } from 'aws-amplify'
import { appColor } from '../../Styles/styles';

class SignIn extends React.Component {

    state = {
        username: '',
        password: '',
        errorMessage: '',
        connectionMessage: ''
    }

    _displayMessage() {
        if (this.state.errorMessage) {
            return (
                <Text style={{fontSize: 16, fontWeight: "600", color: 'red', alignSelf: 'center', marginTop: 10}}>{this.state.errorMessage}</Text>
            )
        }
        else if (this.state.connectionMessage) {
            return (
                <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.7)", alignItems: 'center', justifyContent: "center", width: "100%", height: "100%"}}>
                    <ActivityIndicator
                    size="large"
                    color="white"
                    />
                </View>
            )
        }
    }

    _submitSignIn() {

        // let apiName = 'Openclique';
        // let path = '/places/build'
        // let myInit = {
        //     body: {}
        // }

        // API.post(apiName, path, myInit)
        // .then(response => {
        //     console.log(response)
        // })
        // .catch(error => {
        //     console.log(error.response)
        // })

        this.setState({
            ...this.state,
            errorMessage: '',
            connectionMessage: 'Connection ...'
        })

        Auth.signIn(this.state.username, this.state.password)
        .then(data => {
            let apiName = 'Openclique';
            let path = '/users/' + data.signInUserSession.accessToken.payload.username
            let myInit = {
                queryStringParameters: {
                    "connection": true
                }
            }

            API.get(apiName, path, myInit)
            .then(async response => {

                console.log(response)

                let action = { type: 'CHANGE_CONNECTED_USER', value: response, token: data.signInUserSession.idToken.jwtToken }
                this.props.dispatch(action)

            })
            .catch(error => {
                console.log(error.response)
            });
            
        })
        .catch(err => {
            this.setState({
                ...this.state,
                errorMessage: err.message,
                connectionMessage: ''
            })
        })
    }

    render() {
        return (
            <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: "#EDF1F2"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <SafeAreaView style={{flex: 1, position: 'relative'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                        <View style={{flex: 1, flexDirection: "row", marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate("MainPage")}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <Image
                                source={require("../../Images/logo_red.png")}
                                style={{width: 24, height: 25}}
                                />
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <TouchableOpacity onPress={() => {}}>
                                    <Image
                                    source={require("../../Images/dot_dot_dot_red.png")}
                                    style={{width: 20, height: 20}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flex: 4, alignItems: 'center'}}>
                            <Text style={{fontWeight: "600", fontSize: 24}}>Log in</Text>
                            <View style={{ width: 300, height: 50, backgroundColor: "white", borderRadius: 30, justifyContent: "center", marginBottom: 15, marginTop: 25}}>
                                <TextInput
                                onChangeText={text => this.setState({
                                    username: text
                                })}
                                style={{marginLeft: 20}}
                                autoCapitalize='none'
                                autoCorrect={false}
                                placeholder="Username or Email"
                                placeholderTextColor="#999999"
                                />
                            </View>
                            <View style={{ width: 300, height: 50, backgroundColor: "white", borderRadius: 30, justifyContent: "center"}}>
                                <TextInput
                                onChangeText={text => this.setState({
                                    password: text
                                })}
                                style={{marginLeft: 20}}
                                autoCapitalize='none'
                                autoCorrect={false}
                                placeholder="Password"
                                placeholderTextColor="#999999"
                                secureTextEntry={true}
                                />
                            </View>
                            <TouchableOpacity
                            style={{marginTop: 20, width: 300, borderRadius: 30, backgroundColor: "#F2788C", height: 50, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this._submitSignIn()}
                            >
                                <Text style={{color: 'white', fontSize: 18, fontWeight: "600"}}>Log in</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => alert("Ah bah c'est con fréro")}
                            style={{marginTop: 30}}
                            >
                                <Text style={{color: appColor}}>Forgot password ?</Text>
                            </TouchableOpacity>
                        </View>
                        {this._displayMessage()}
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: appColor
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SignIn)