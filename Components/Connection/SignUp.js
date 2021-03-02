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
        index: 0,
        medias: [],
        hair: "black",
        type: "skin",
        skin: 1,
        eyes: "black",
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
            this.setState({ ...this.state, phoneNumber: "+1" + this.state.phoneNumber, index: this.state.index + 1 })
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
                            {
                                this.state.firstName.length === 0 && <Text style={{fontSize: 18}}>First name</Text>
                            }
                            <TextInput
                            onChangeText={text => this.setState({
                                firstName: text
                            })}
                            style={styles.input}
                            autoCapitalize='words'
                            value={this.state.firstName}
                            autoCorrect={false}
                            />
                            {
                                this.state.lastName.length === 0 && <Text style={{fontSize: 18}}>Last name</Text>
                            }
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
                            <Text style={{fontSize: 18, textAlign: 'center'}}>Your password must be at least 6 characters long.</Text>
                        </View>
                        <View style={{flex: 10, width: "100%", justifyContent: 'center', alignItems: 'center'}}>
                                {
                                    this.state.password.length == 0 && <Text style={{fontSize: 18}}>Password</Text>
                                }
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
                            {
                                this.state.confirmPassword.length > 0
                                ?
                                    null
                                :
                                    <Text style={{fontSize: 18}}>Confirm password</Text>
                            }
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
                            {
                                this.state.phoneNumber.length === 0 && 
                                <View
                                style={{  flexDirection: "row" }}
                                >
                                    <View
                                    style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                    />
                                    <Text style={{fontSize: 18}}>Phone number</Text>
                                </View>
                            }
                            <View
                            style={{  flexDirection: "row" }}
                            >
                                <View
                                style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                >
                                    <Text style={{fontSize: 18}}>+1</Text>
                                </View>
                                <TextInput
                                onChangeText={text => this.setState({
                                    phoneNumber: text
                                })}
                                style={styles.input}
                                autoCapitalize='none'
                                value={this.state.phoneNumber}
                                autoCorrect={false}
                                keyboardType={"phone-pad"}
                                placeholder="9993334444"
                                maxLength={10}
                                />
                            </View>
                            {
                                this.state.email.length === 0 && 
                                <View
                                style={{  flexDirection: "row" }}
                                >
                                    <View
                                    style={{height: 30, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                    />
                                    <Text style={{fontSize: 18}}>Email address</Text>
                                </View>
                            }
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
                            {
                                this.state.username.length > 0
                                ?
                                    null
                                :
                                    <Text style={{fontSize: 18}}>Username</Text>
                            }
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


            // case 5:
            //     return (
            //         <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            //             <View style={{flexDirection: "row", flex: 1, margin: 7}}>
            //                 <View style={{flex: 1}}>
            //                     <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
            //                         <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <View style={{flex: 3}}/>
            //                 <View style={{flex: 1}}/>
            //             </View>
            //             <View style={{flex: 8, width: "100%", alignItems: 'center', position: "relative"}}>
            //                 <View style={{position: 'relative', alignItems: 'center'}}>
            //                     <Image
            //                     source={this._getSkin()}
            //                     style={{height: 250, width: 76, position: "relative"}}
            //                     />
            //                     <Image
            //                     source={require("../../Images/Items/Bottoms/black_basic_shorts.png")}
            //                     style={{height: 70, width: 50, top: 117, position: 'absolute'}}
            //                     />
            //                     <Image
            //                     source={require("../../Images/Items/Tops/pink_tee.png")}
            //                     style={{height: 85, width: 75, top: 40, position: 'absolute'}}
            //                     />
            //                     <Image
            //                     source={require("../../Images/Items/Footwear/black_slip_ons.png")}
            //                     style={{height: 16.94, width: 66.75, bottom: 0, position: 'absolute'}}
            //                     />
            //                     <Image
            //                     source={this._getEyes()}
            //                     style={{height: 5.5, width: 20.4, top: 15, position: 'absolute'}}
            //                     />
            //                     <Image
            //                     source={this._getHair()}
            //                     style={{height: 25.2, width: 25.8, top: -2.2, position: 'absolute'}}
            //                     />
            //                 </View>
            //                 <View style={{width: "100%", alignItems: 'center', margin: 30}}>
            //                     {
            //                         this.state.username.length > 0
            //                         ?
            //                             null
            //                         :
            //                             <Text style={{fontSize: 18}}>Choose your name</Text>
            //                     }
            //                     <TextInput
            //                     onChangeText={text => this.setState({
            //                         username: text
            //                     })}
            //                     style={{ textAlign: 'center', minWidth: "40%", minHeight: 30, borderBottomWidth: 0.5, fontSize: 20, marginBottom: 30 }}
            //                     multiline={true}
            //                     autoCapitalize='none'
            //                     value={this.state.username}
            //                     autoCorrect={false}
            //                     keyboardType="default"
            //                     />
            //                 </View>
            //             </View>
            //             <View style={{flex: 2}}>
            //                 <TouchableOpacity
            //                 style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: (this.state.username.length > 0) ? appColor: "lightgray", alignItems: 'center', justifyContent: 'center'}}
            //                 onPress={() => this.setState({ index: this.state.index + 1 })}
            //                 disabled={!(this.state.username.length > 0)}
            //                 >
            //                     <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Next</Text>
            //                 </TouchableOpacity>
            //             </View>
            //         </SafeAreaView>
            //     )
            
            // case 6:
            //     return (
            //         <SafeAreaView style={{marginBottom: 20, flex: 1}}>
            //             <View style={{flex: 1, flexDirection: 'row'}}>
            //                 <View style={{flex: 1}}>
            //                     <TouchableOpacity onPress={this._onBackPressed} style={{position: 'absolute', left: 10, top: 0}}>
            //                         <Image source={require('../../Images/goBack.png')} style={{height: 22, width: 14}}/>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <View style={{flex: 3, alignItems: 'center'}}>
            //                     <Text style={{fontSize: 17, fontWeight: "600"}}>{this.state.username}</Text>
            //                 </View>
            //                 <View style={{flex: 1}}></View>
            //             </View>
            //             <View style={{flex: 8}}>
            //                 <View style={{flexDirection: 'row', alignItems: 'center', flex: 3,}}>
            //                     <View style={{flex: 5, height: 300, justifyContent: 'space-evenly'}}>
            //                         <View style={{margin: 5}}>
            //                             <View
            //                             style={{height: 3, width: '100%', backgroundColor: 'lightgray', marginTop: 3, marginBottom: 3}}
            //                             />
            //                         </View>
            //                         <View style={{margin: 5}}>
            //                             <Text style={{marginLeft: 7, fontWeight: "600"}}>Pink Tee</Text>
            //                             <View
            //                             style={{height: 3, width: '100%', backgroundColor: 'lightgray', marginTop: 3, marginBottom: 3}}
            //                             />
            //                             <Text style={{marginLeft: 7}}>Openclique 1.0.0</Text>
            //                         </View>
            //                         <View style={{margin: 5}}>
            //                             <Text style={{marginLeft: 7, fontWeight: "600"}}>Black Basic Shorts</Text>
            //                             <View
            //                             style={{height: 3, width: '100%', backgroundColor: 'lightgray', marginTop: 3, marginBottom: 3}}
            //                             />
            //                             <Text style={{marginLeft: 7}}>Openclique 1.0.0</Text>
            //                         </View>
            //                         <View style={{margin: 5}}>
            //                             <Text style={{marginLeft: 7, fontWeight: "600"}}>Black Slip Ons</Text>
            //                             <View
            //                             style={{height: 3, width: '100%', backgroundColor: 'lightgray', marginTop: 3, marginBottom: 3}}
            //                             />
            //                             <Text style={{marginLeft: 7}}>Openclique 1.0.0</Text>
            //                         </View>
            //                     </View>
            //                     <View style={{flex: 3, justifyContent: 'center'}}>
            //                         <View style={{position: 'relative', alignItems: 'center'}}>
            //                             <Image
            //                             source={this._getSkin()}
            //                             style={{height: 250, width: 76, position: "relative"}}
            //                             />
            //                             <Image
            //                             source={require("../../Images/Items/Bottoms/black_basic_shorts.png")}
            //                             style={{height: 70, width: 50, top: 117, position: 'absolute'}}
            //                             />
            //                             <Image
            //                             source={require("../../Images/Items/Tops/pink_tee.png")}
            //                             style={{height: 85, width: 75, top: 40, position: 'absolute'}}
            //                             />
            //                             <Image
            //                             source={require("../../Images/Items/Footwear/black_slip_ons.png")}
            //                             style={{height: 16.94, width: 66.75, bottom: 0, position: 'absolute'}}
            //                             />
            //                             <Image
            //                             source={this._getEyes()}
            //                             style={{height: 5.5, width: 20.4, top: 15, position: 'absolute'}}
            //                             />
            //                             <Image
            //                             source={this._getHair()}
            //                             style={{height: 25.2, width: 25.8, top: -2.2, position: 'absolute'}}
            //                             />
            //                         </View>
            //                     </View>
            //                 </View>
            //                 <View style={{flex: 1, justifyContent: 'center'}}>
            //                     <ProgressBar cliquepoints={0} minPoints={0} maxPoints={100}/>
            //                 </View>
            //                 <View style={{margin: 15, flex: 1, justifyContent: 'center'}}>
            //                     <Text style={{fontWeight: "600"}}>You are a member of:</Text>
            //                     <View style={{flexDirection: 'row', marginTop: 10}}>
            //                         <View style={{flex: 4}}>
            //                             <Text style={{ color: appColor, fontWeight: "600", flex: 4}}>Openclique 1.0 Community</Text>
            //                         </View>
            //                         <View style={{flex: 3, alignItems: 'flex-end'}}>
            //                             <Text>99 members</Text>
            //                         </View>
            //                     </View>
            //                 </View>
            //             </View>
            //             <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
            //                 <TouchableOpacity
            //                 style={{ height: 40, width: 200, borderRadius: 15, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center'}}
            //                 onPress={this._onCreatePressed}
            //                 >
            //                     <Text style={{color: "white", fontWeight: "600", fontSize: 16}}>Create</Text>
            //                 </TouchableOpacity>
            //             </View>
            //         </SafeAreaView>
            //     )
        }
    }

    _displayColors() {
        if (this.state.type === "hair") {
            return (
                <React.Fragment>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "black" ? "white" : "black", backgroundColor: "black"}}
                    onPress={() => this.setState({ hair: "black" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "blue" ? "white" : "black", backgroundColor: "blue"}}
                    onPress={() => this.setState({ hair: "blue" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "brown" ? "white" : "black", backgroundColor: "brown"}}
                    onPress={() => this.setState({ hair: "brown" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "green" ? "white" : "black", backgroundColor: "green"}}
                    onPress={() => this.setState({ hair: "green" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "pink" ? "white" : "black", backgroundColor: "pink"}}
                    onPress={() => this.setState({ hair: "pink" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "red" ? "white" : "black", backgroundColor: "red"}}
                    onPress={() => this.setState({ hair: "red" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: this.state.hair !== "white" ? 0.5 : 2, borderColor: this.state.hair !== "white" ? "black" : "black", backgroundColor: "white"}}
                    onPress={() => this.setState({ hair: "white" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.hair !== "yellow" ? "white" : "black", backgroundColor: "yellow"}}
                    onPress={() => this.setState({ hair: "yellow" })}
                    >
                    </TouchableOpacity>
                </React.Fragment>
            )
        } else if (this.state.type === "eyes") {
            return (
                <React.Fragment>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "black" ? "white" : "black", backgroundColor: "black"}}
                    onPress={() => this.setState({ eyes: "black" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "blue" ? "white" : "black", backgroundColor: "blue"}}
                    onPress={() => this.setState({ eyes: "blue" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "brown" ? "white" : "black", backgroundColor: "brown"}}
                    onPress={() => this.setState({ eyes: "brown" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "green" ? "white" : "black", backgroundColor: "green"}}
                    onPress={() => this.setState({ eyes: "green" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "pink" ? "white" : "black", backgroundColor: "pink"}}
                    onPress={() => this.setState({ eyes: "pink" })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.eyes !== "red" ? "white" : "black", backgroundColor: "red"}}
                    onPress={() => this.setState({ eyes: "red" })}
                    >
                    </TouchableOpacity>
                </React.Fragment>
            )
        } else if (this.state.type === "skin") {
            return (
                <React.Fragment>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 1 ? "white" : "black", backgroundColor: "#EACEB1"}}
                    onPress={() => this.setState({ skin: 1 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 2 ? "white" : "black", backgroundColor: "#E4B38C"}}
                    onPress={() => this.setState({ skin: 2 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 3 ? "white" : "black", backgroundColor: "#E1B685"}}
                    onPress={() => this.setState({ skin: 3 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 4 ? "white" : "black", backgroundColor: "#DAA975"}}
                    onPress={() => this.setState({ skin: 4 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 5 ? "white" : "black", backgroundColor: "#C58D60"}}
                    onPress={() => this.setState({ skin: 5 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 6 ? "white" : "black", backgroundColor: "#B17B52"}}
                    onPress={() => this.setState({ skin: 6 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 7 ? "white" : "black", backgroundColor: "#93603D"}}
                    onPress={() => this.setState({ skin: 7 })}
                    >
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: 40, height: 40, borderRadius: 20, margin: 7, borderWidth: 2, borderColor: this.state.skin !== 8 ? "white" : "black", backgroundColor: "#815130"}}
                    onPress={() => this.setState({ skin: 8 })}
                    >
                    </TouchableOpacity>
                </React.Fragment>
            )
        }
    }

    _getHair() {
        switch(this.state.hair) {
            case "black":
                return require("../../Images/Items/Hair/black_hair.png");
            case "blue":
                return require("../../Images/Items/Hair/blue_hair.png");
            case "brown":
                return require("../../Images/Items/Hair/brown_hair.png");
            case "green":
                return require("../../Images/Items/Hair/green_hair.png");
            case "pink":
                return require("../../Images/Items/Hair/pink_hair.png");
            case "red":
                return require("../../Images/Items/Hair/red_hair.png");
            case "white":
                return require("../../Images/Items/Hair/white_hair.png");
            case "yellow":
                return require("../../Images/Items/Hair/yellow_hair.png");
        }
    }

    _getEyes() {
        switch(this.state.eyes) {
            case "black":
                return require("../../Images/Items/Eyes/black_eyes.png");
            case "blue":
                return require("../../Images/Items/Eyes/blue_eyes.png");
            case "brown":
                return require("../../Images/Items/Eyes/brown_eyes.png");
            case "green":
                return require("../../Images/Items/Eyes/green_eyes.png");
            case "pink":
                return require("../../Images/Items/Eyes/pink_eyes.png");
            case "red":
                return require("../../Images/Items/Eyes/red_eyes.png");
        }
    }

    _getSkin() {
        switch(this.state.skin) {
            case 1:
                return require("../../Images/Items/Skins/skin_1.png");
            case 2:
                return require("../../Images/Items/Skins/skin_2.png");
            case 3:
                return require("../../Images/Items/Skins/skin_3.png");
            case 4:
                return require("../../Images/Items/Skins/skin_4.png");
            case 5:
                return require("../../Images/Items/Skins/skin_5.png");
            case 6:
                return require("../../Images/Items/Skins/skin_6.png");
            case 7:
                return require("../../Images/Items/Skins/skin_7.png");
            case 8:
                return require("../../Images/Items/Skins/skin_8.png");
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
        width: '65%',
        height: 30,
        borderBottomWidth: 0.5,
        alignSelf: 'center',
        fontSize: 20,
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