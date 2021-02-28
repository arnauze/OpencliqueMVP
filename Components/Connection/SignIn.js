import React from 'react'
import { Image, TextInput, StyleSheet, TouchableOpacity, View, Text, ScrollView, SafeAreaView} from 'react-native'
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
                <Text style={{fontSize: 16, color: 'red', fontWeight: '100', alignSelf: 'center', marginTop: 10}}>{this.state.errorMessage}</Text>
            )
        }
        else if (this.state.connectionMessage) {
            return (
                <Text style={{fontSize: 16, color: 'black', fontWeight: '200', alignSelf: 'center', marginTop: 10}}>{this.state.connectionMessage}</Text>
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

                // let key = "items/" + response.character.avatar.hair.key
                // let resp = await Storage.get(key, { level: 'public' })
                // response.character.avatar.hair.url = resp;

                // key = "items/" + response.character.avatar.eyes.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.avatar.eyes.url = resp;

                // key = "items/" + response.character.avatar.skin.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.avatar.skin.url = resp;

                // key = "items/" + response.character.items.hat.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.items.hat.url = resp;

                // key = "items/" + response.character.items.top.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.items.top.url = resp;

                // key = "items/" + response.character.items.bottom.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.items.bottom.url = resp;

                // key = "items/" + response.character.items.shoes.key
                // resp = await Storage.get(key, { level: 'public' })
                // response.character.items.shoes.url = resp;

                let action = { type: 'CHANGE_CONNECTED_USER', value: response, token: data.signInUserSession.idToken.jwtToken }
                this.props.dispatch(action)

                // let action2 = { type: 'CHANGE_FILTERS', value: {
                //     filters: response.info.preferences.filters,
                //     user: response.info
                // }}
                // this.props.dispatch(action2)

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
            <SafeAreaView style={{flex: 1, position: 'relative'}}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{position: 'absolute', left: 10, top: 0}}>
                        <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                    </TouchableOpacity>
                    {
                        this.state.username.length > 0
                        ?
                            null
                        :
                            <Text>Username or email address</Text>
                    }
                    <TextInput
                    onChangeText={text => this.setState({
                        username: text
                    })}
                    style={styles.input}
                    autoCapitalize='none'
                    autoCorrect={false}
                    />
                    {
                        this.state.password.length > 0
                        ?
                            null
                        :
                            <Text>Password</Text>
                    }
                    <TextInput
                    secureTextEntry={true}
                    onChangeText={text => this.setState({
                        password: text
                    })}
                    style={styles.input}
                    onSubmitEditing={() => this._submitSignIn()}
                    autoCapitalize='none'
                    autoCorrect={false}
                    />
                    <TouchableOpacity>
                        <Text style={{color: appColor}}>Forgot password ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{marginTop: 20, width: '90%'}}
                    onPress={() => this._submitSignIn()}
                    >
                        <View style={styles.button}>
                            <Text style={{color: 'white'}}>Sign in</Text>
                        </View>
                    </TouchableOpacity>
                    {this._displayMessage()}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        width: '65%',
        height: 30,
        borderBottomWidth: 0.3,
        alignSelf: 'center',
        fontSize: 20,
        marginBottom: 10
    },
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