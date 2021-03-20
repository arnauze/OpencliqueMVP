import React from 'react'
import { Image, TextInput, StyleSheet, TouchableOpacity, View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Auth, API, Storage } from 'aws-amplify'
import {appColor, almostWhite} from '../../Styles/styles'
import ItemsInformations from '../Profile/ItemsInformations';
import ProgressBar from '../Profile/ProgressBar'

// I need to make the page more beautiful 

class SignUp extends React.Component {

    state = {
        firstName: '',
        lastName: '',
        date: {
            year:"",
            month:"",
            day: ""
        },
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        email: "",
        error_message: '',
        confirmation_message: '',
        confirmCode: '',
        index: 0,
        medias: [],
        username: "",
        loading: false
    }

    _sendUserInfo(data) {

        // After a succesfull signup I use that function to send the user informations to the database.
        // Auth.signUp stores the user in AWS Cognito's database, while that function stores the user in the dynamoDB

        var body = {
            "id": data.userSub,
            "username": this.state.username,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "email": this.state.email,
            "phoneNumber": this.state.phoneNumber,
            "confirmed": false,
        }
        console.log(body)

        let apiName = 'Openclique';
        let path = '/users'; 
        let myInit = {
            body: body,
            queryStringParameters: {
                "TableName": "users"
            }
        }
        API.post(apiName, path, myInit).then(response => {
            this.props.navigation.navigate('Map')
        }).catch(error => {
            console.log("Error 2")
            console.log(error)
        });
    }

    _onCreatePressed = () => {

        this.setState({
            ...this.state,
            loading: true
        })

        Auth.signUp({
            username: this.state.username,
            password: this.state.password,
            attributes: {
                email: this.state.email,
                phone_number: this.state.phoneNumber
            }
        })
        .then(data => {
            console.log("SUCCESS")
            this.setState({
                ...this.state,
                loading: false
            })
            this._sendUserInfo(data)
        })
        .catch(err => {

            console.log("ERROR");
            console.log(err)
            alert(err.message || err)
            this.setState({
                confirmation_message: '',
                error_message: err.message || err,
                loading: false
            })

        })


    }

    _onBackPressed = () => {
        if (this.state.index > 0) {
            this.setState({
                index: this.state.index - 1
            })
        } else {
            this.props.navigation.goBack()
        }
    }

    _onConfirmPassword = () => {
        if (this.state.password < 6) {
            alert("Your password must be at least 6 characters long.")
        } else if (this.state.password !== this.state.confirmPassword) {
            alert("The passwords don't match.")
        } else {
            this.setState({ index: this.state.index + 1 })
        }
    }

    _onConfirmPhoneNumber = () => {
        // let phone = this.state.phoneNumber.indexOf("+1") >= 0 ? this.state.phoneNumber : "+1" + this.state.phoneNumber
        let phone = this.state.phoneNumber
        Auth.signUp({
            username: this.state.username,
            password: this.state.password,
            attributes: {
                email: this.state.email,
                phone_number: phone
            }
        })
        .then(data => {
            console.log("SUCCESS")
            this.setState({ ...this.state, phoneNumber: phone, index: this.state.index + 1 })  
            this._sendUserInfo(data)
        })
    }

    _onSignupComplete = () => {

        this.setState({...this.state, loading: true})

        Auth.signIn("arnauze", "49ok3042")
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
                alert(error.response || error)
                console.log(error.response)
                this.setState({...this.state, loading: false})
            });
            
        })
        .catch(err => {
            alert(err.message || err)
            this.setState({
                ...this.state,
                errorMessage: err.message,
                connectionMessage: '',
                loading: false
            })
        })
    }

    _confirmCode = () => {
        // Add Auth.confirm code
        Auth.confirmSignUp(this.state.username, this.state.confirmCode)
        .then(response => {
            this.setState({ ...this.state, index: this.state.index + 1 })
        })
        .catch(err => {
            alert(err.message || err)
        })
    }

    _displayPage() {
        switch (this.state.index) {
            case 0:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                        <View style={{flex: 4, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 22, fontWeight: "500"}}>What's your name?</Text>
                            <View style={{width: 300, justifyContent: 'center', height: 50, backgroundColor: "white", borderRadius: 30, marginVertical: 15}}>
                                <TextInput
                                style={{marginLeft: 20}}
                                onChangeText={text => this.setState({
                                    firstName: text
                                })}
                                autoCapitalize='words'
                                value={this.state.firstName}
                                autoCorrect={false}
                                placeholder="First name"
                                />
                            </View>
                            <View style={{width: 300, justifyContent: 'center', height: 50, backgroundColor: "white", borderRadius: 30, marginBottom: 15}}>
                                <TextInput
                                style={{marginLeft: 20}}
                                onChangeText={text => this.setState({
                                    lastName: text
                                })}
                                autoCapitalize='words'
                                value={this.state.lastName}
                                autoCorrect={false}
                                placeholder="Last name"
                                />
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: !(this.state.firstName.length > 0 && this.state.lastName.length > 0) ? "lightgray" : "#F2788C", alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this.setState({ index: this.state.index + 1 })}
                            disabled={!(this.state.firstName.length > 0 && this.state.lastName.length > 0)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginHorizontal: 67, marginTop: 30}}>
                            <TouchableOpacity
                            onPress={() => {}}
                            >
                                <Text style={{textAlign: 'center', color: appColor}}>By signing up you agree to our Terms of Use and Privacy Policy.</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 5, alignItems: 'center', justifyContent: "flex-end"}}>
                            <Text style={{color: appColor}}>Already have an account? <Text style={{fontWeight: "600"}}>Log in</Text></Text>
                        </View>
                    </SafeAreaView>
                )
            
            case 1:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                            <Text style={{fontWeight: "500", fontSize: 20 }}>When's your birthday?</Text>
                            <View style={{flexDirection: "row", width: 300, height: 50, backgroundColor: "white", borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 25, marginBottom: 80}}>
                                <TextInput
                                maxLength={2}
                                onChangeText={text => this.setState({
                                    date: {
                                        ...this.state.date, 
                                        month: text
                                    } 
                                }, () => { this.state.date.month.length == 2 ? this._dd.focus() : null})}
                                ref={c => this._mm = c}
                                style={{ textAlign: 'left', fontSize: 17 }}
                                autoCapitalize='none'
                                placeholder="MM"
                                placeholderTextColor="gray"
                                value={this.state.date.month}
                                keyboardType={"numeric"}
                                />
                                <Text style={{fontSize: 17, margin: 10}}>/</Text>
                                <TextInput
                                ref={c => this._dd = c}
                                maxLength={2}
                                onChangeText={text => this.setState({
                                    date: {
                                        ...this.state.date, 
                                        day: text
                                    } 
                                }, () => { this.state.date.day.length == 2 ? this._yyyy.focus() : this.state.date.day.length == 0 ? this._mm.focus() : null})}
                                style={{ textAlign: 'left', fontSize: 17 }}
                                autoCapitalize='none'
                                placeholder="DD"
                                placeholderTextColor="gray"
                                value={this.state.date.day}
                                keyboardType={"numeric"}
                                />
                                <Text style={{fontSize: 17, margin: 10}}>/</Text>
                                <TextInput
                                maxLength={4}
                                ref={c => this._yyyy = c}
                                onChangeText={text => this.setState({
                                    date: {
                                        ...this.state.date,
                                        year: text
                                    }
                                },() => { this.state.date.year.length == 0 ? this._dd.focus() : null})}
                                style={{textAlign: 'left', fontSize: 17 }}
                                autoCapitalize='none'
                                placeholder="YYYY"
                                placeholderTextColor="gray"
                                value={this.state.date.year}
                                keyboardType={"numeric"}
                                />
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: !(this.state.date.month.length === 2 && this.state.date.day.length === 2 && this.state.date.year.length === 4) ? "lightgray" : "#F2788C", alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this.setState({ index: this.state.index + 1 })}
                            disabled={!(this.state.date.month.length === 2 && this.state.date.day.length === 2 && this.state.date.year.length === 4)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )
        
            case 2:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                            <Text style={{fontWeight: "500", fontSize: 20}}>Your username</Text>
                            <View style={{width: 300, height: 50, backgroundColor: "white", borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 80}}>
                                <TextInput
                                onChangeText={text => this.setState({
                                    username: text
                                })}
                                autoCapitalize='none'
                                value={this.state.username}
                                autoCorrect={false}
                                placeholder="Enter username"
                                />
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: (this.state.username.length >= 1) ? "#F2788C" : "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this.setState({ ...this.state, index: this.state.index + 1 })}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 5}}></View>
                    </SafeAreaView>
                )

            case 3:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                        <View style={{flex: 4, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 22, fontWeight: "500"}}>Set a password</Text>
                            <View style={{width: 300, justifyContent: 'center', height: 50, backgroundColor: "white", borderRadius: 30, marginVertical: 15}}>
                                <TextInput
                                style={{marginLeft: 20}}
                                onChangeText={text => this.setState({
                                    password: text
                                })}
                                secureTextEntry={true}
                                value={this.state.password}
                                autoCorrect={false}
                                placeholder="Password"
                                />
                            </View>
                            <View style={{width: 300, justifyContent: 'center', height: 50, backgroundColor: "white", borderRadius: 30, marginBottom: 15}}>
                                <TextInput
                                style={{marginLeft: 20}}
                                onChangeText={text => this.setState({
                                    confirmPassword: text
                                })}
                                secureTextEntry={true}
                                value={this.state.confirmPassword}
                                autoCorrect={false}
                                placeholder="Re-enter password"
                                />
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: !(this.state.password.length > 0 && this.state.confirmPassword.length > 0) ? "lightgray" : "#F2788C", alignItems: 'center', justifyContent: 'center'}}
                            onPress={this._onConfirmPassword}
                            disabled={!(this.state.password.length > 0 && this.state.confirmPassword.length > 0)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginHorizontal: 67, marginTop: 30}}>
                            <TouchableOpacity
                            onPress={() => {}}
                            >
                                <Text style={{textAlign: 'center', color: appColor}}>Your password must be at least 6 characters long.</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 5, alignItems: 'center', justifyContent: "flex-end"}}>
                        </View>
                    </SafeAreaView>
                )
            case 4:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                            <Text style={{fontWeight: "500", fontSize: 20}}>What's your mobile number?</Text>
                            <View style={{width: 300, height: 50, backgroundColor: "white", borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 15}}>
                                <TextInput
                                onChangeText={text => this.setState({
                                    phoneNumber: text
                                })}
                                autoCapitalize='none'
                                value={this.state.phoneNumber}
                                autoCorrect={false}
                                placeholder="Mobile number"
                                secureTextEntry={false}
                                />
                            </View>
                            <View style={{height: 18, marginBottom: 47}}>
                                <Text style={{color: appColor}}>We'll send you a verification code.</Text>
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: (this.state.phoneNumber.length == 12) ? "#F2788C" : "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={this._onConfirmPhoneNumber}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 5}}></View>
                    </SafeAreaView>
                )
            case 5:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                        <View style={{flexDirection: "row", flex: 1, marginHorizontal: 20, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
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
                            <Text style={{fontWeight: "500", fontSize: 20}}>Enter verification code</Text>
                            <View style={{width: 300, height: 50, backgroundColor: "white", borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginTop: 25, marginBottom: 15}}>
                                <TextInput
                                onChangeText={text => this.setState({
                                    confirmCode: text
                                })}
                                autoCapitalize='none'
                                value={this.state.confirmCode}
                                autoCorrect={false}
                                secureTextEntry={false}
                                placeholder="Verification code"
                                />
                            </View>
                            <View style={{height: 18, marginBottom: 47}}>
                                <Text style={{color: appColor}}>Enter the code we sent to {this.state.phoneNumber}.</Text>
                            </View>
                            <TouchableOpacity
                            style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: (this.state.confirmCode.length === 6) ? "#F2788C" : "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this._confirmCode()}
                            disabled={this.state.confirmCode.length !== 6}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 5}}></View>
                    </SafeAreaView>
                )
            case 6:
                return (
                    this.state.loading ?
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", alignItems: 'center', justifyContent: 'center', width: "100%"}}>
                        <ActivityIndicator
                        size="large"
                        />
                    </View>
                    :
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: "#EDF1F2"}}>
                            <Text style={{fontWeight: "600", fontSize: 24, color: appColor, marginBottom: 36}}>You're all set up!</Text>
                        <TouchableOpacity
                        style={{ height: 50, width: 300, borderRadius: 30, backgroundColor: "#F2788C", alignItems: 'center', justifyContent: 'center'}}
                        onPress={this._onSignupComplete}
                        >
                            <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Start discovering</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                )

        }
    }

    render() {
        return (
            <KeyboardAvoidingView
            style={{flex: 1, backgroundColor: almostWhite}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {
                    this.state.loading &&
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", alignItems: 'center', justifyContent: 'center', width: "100%"}}>
                        <ActivityIndicator
                        size="large"
                        />
                    </View>
                }
                {this._displayPage()}
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        minWidth: '65%',
        minHeight: 30,
        borderBottomWidth: 0.3,
        alignSelf: 'center',
        fontSize: 20,
        margin: 10,
        marginBottom: 30,
        textAlign: 'center'
    },
    main_container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderWidth: 0.5,
        marginTop: 10,
        backgroundColor: "white"
    },
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SignUp)