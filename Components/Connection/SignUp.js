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
        index: 3,
        medias: [],
        username: "",
        loading: false
    }

    async componentDidMount() {
        // var key = "items" + '/' + "skin_1.png"
        // let response = await Storage.get(key, { level: 'public' })

        // console.log(response)

        // var media = this.state.medias.concat(response)
        // this.setState({
        //     medias: media
        // })
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
            this.props.navigation.navigate('SignIn')
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

    _onNextPhoneEmail = () => {
        if (this.state.phoneNumber.length < 10) {
            alert("Phone number has to be 10 characters long.")
        } else {
            this.setState({ ...this.state, phoneNumber: this.state.phoneNumber.indexOf("+1") >= 0 ? this.state.phoneNumber : "+1" + this.state.phoneNumber, index: this.state.index + 1 })
        }
    }

    _displayPage() {
        switch (this.state.index) {
            case 0:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <View style={{flexDirection: "row", flex: 1, margin: 7}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <Text style={{fontWeight: "600", fontSize: 20, color: appColor}}>What is your name?</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 8, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: "600"}}>First name</Text>
                            <TextInput
                            onChangeText={text => this.setState({
                                firstName: text
                            })}
                            style={styles.input}
                            autoCapitalize='words'
                            value={this.state.firstName}
                            autoCorrect={false}
                            />
                            <Text style={{fontSize: 18, fontWeight: "600"}}>Last name</Text>
                            <TextInput
                            onChangeText={text => this.setState({
                                lastName: text
                            })}
                            style={styles.input}
                            autoCapitalize='words'
                            value={this.state.lastName}
                            autoCorrect={false}
                            />
                        </View>
                        <View style={{flex: 1, margin: 30}}>
                            <TouchableOpacity
                            style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: !(this.state.firstName.length > 0 && this.state.lastName.length > 0) ? "lightgray" : appColor, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => this.setState({ index: this.state.index + 1 })}
                            disabled={!(this.state.firstName.length > 0 && this.state.lastName.length > 0)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )
            
            case 1:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <View style={{flexDirection: "row", flex: 1, margin: 7}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <Text style={{fontWeight: "600", fontSize: 20, color: appColor}}>What is your date of birth?</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 8, width: "100%", justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
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
                        <View style={{flex: 1, margin: 30}}>
                            <TouchableOpacity
                            style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: !(this.state.date.month.length === 2 && this.state.date.day.length === 2 && this.state.date.year.length === 4) ? "lightgray" : appColor, alignItems: 'center', justifyContent: 'center'}}
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
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <View style={{flexDirection: "row", flex: 1, margin: 7}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <Text style={{fontWeight: "600", fontSize: 20, color: appColor}}>Create your password</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 2, alignItems: 'center', margin: 7, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, textAlign: 'center', fontWeight: "600"}}>Your password must be at least 6 characters long.</Text>
                        </View>
                        <View style={{flex: 10, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: "600"}}>Password</Text>
                            <TextInput
                            onChangeText={text => this.setState({
                                password: text
                            })}
                            secureTextEntry={true}
                            style={styles.input}
                            autoCapitalize='none'
                            value={this.state.paswword}
                            autoCorrect={false}
                            />
                            <Text style={{fontSize: 18, fontWeight: "600"}}>Confirm password</Text>
                            <TextInput
                            onChangeText={text => this.setState({
                                confirmPassword: text
                            })}
                            style={styles.input}
                            autoCapitalize='none'
                            value={this.state.confirmPassword}
                            autoCorrect={false}
                            secureTextEntry={true}
                            />
                        </View>
                        <View style={{flex: 1, margin: 30}}>
                            <TouchableOpacity
                            style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: (this.state.password.length >= 6 && this.state.confirmPassword.length >= 6) ? appColor : "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={this._onConfirmPassword}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )

            case 3:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <View style={{flexDirection: "row", flex: 1, margin: 7}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <Text style={{fontWeight: "600", fontSize: 20, color: appColor}}>Enter more information</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 8, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <View
                            style={{  flexDirection: "row" }}
                            >
                                <View
                                style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                />
                                <Text style={{fontSize: 18, fontWeight: "600"}}>Phone number</Text>
                            </View>
                            <View
                            style={{  flexDirection: "row" }}
                            >
                                <View
                                style={{height: 50, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                >
                                    <Text style={{fontSize: 18}}>+1</Text>
                                </View>
                                <TextInput
                                onChangeText={text => this.setState({
                                    phoneNumber: text
                                })}
                                style={styles.input}
                                autoCapitalize='none'
                                value={this.state.phoneNumber.indexOf("+1") >= 0 ? this.state.phoneNumber.substring(2, this.state.phoneNumber.length) : this.state.phoneNumber}
                                autoCorrect={false}
                                keyboardType={"phone-pad"}
                                placeholder="9993334444"
                                maxLength={10}
                                />
                            </View>
                            <View
                            style={{  flexDirection: "row" }}
                            >
                                <View
                                style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                />
                                <Text style={{fontSize: 18, fontWeight: "600"}}>Email address</Text>
                            </View>
                            <View
                            style={{  flexDirection: "row" }}
                            >
                                <View
                                style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                >
                                </View>
                                <TextInput
                                onChangeText={text => this.setState({
                                    email: text
                                })}
                                style={styles.input}
                                autoCapitalize='none'
                                value={this.state.email}
                                autoCorrect={false}
                                keyboardType="email-address"
                                />
                            </View>
                        </View>
                        <View style={{flex: 1, margin: 30}}>
                            <TouchableOpacity
                            style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: (this.state.phoneNumber.length > 0 && this.state.email.length > 0) ? appColor: "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={this._onNextPhoneEmail}
                            disabled={!(this.state.phoneNumber.length > 0 && this.state.email.length > 0)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                )
            case 4:
                return (
                    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <View style={{flexDirection: "row", flex: 1, margin: 7}}>
                            <View style={{flex: 1}}>
                                <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
                                    <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 3, alignItems: 'center'}}>
                                <Text style={{fontWeight: "600", fontSize: 20, color: appColor}}>Enter more information</Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 8, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{fontSize: 18, fontWeight: "600"}}>Username</Text>
                            <TextInput
                            onChangeText={text => this.setState({
                                username: text
                            })}
                            style={styles.input}
                            autoCapitalize='none'
                            value={this.state.username}
                            autoCorrect={false}
                            keyboardType={"default"}
                            />
                        </View>
                        <View style={{flex: 1, margin: 30}}>
                            <TouchableOpacity
                            style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: (this.state.phoneNumber.length > 0 && this.state.email.length > 0) ? appColor: "lightgray", alignItems: 'center', justifyContent: 'center'}}
                            onPress={this._onCreatePressed}
                            disabled={!(this.state.phoneNumber.length > 0 && this.state.email.length > 0)}
                            >
                                <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Register</Text>
                            </TouchableOpacity>
                        </View>
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
                    this.state.loading ?
                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.8)", alignItems: 'center', justifyContent: 'center', width: "100%"}}>
                        <ActivityIndicator
                        size="large"
                        />
                    </View> : this._displayPage()
                }
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