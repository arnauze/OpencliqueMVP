import React from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native'
import { appColor } from '../../Styles/styles'
import BackIcon from "./BackIcon"
import { API } from 'aws-amplify'
import { launchImageLibrary } from 'react-native-image-picker'

const { height, width } = Dimensions.get("screen")

export default class SendBugReport extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <BackIcon navigation={navigation}/>
        }
    }

    state = {
        bugInfo: "",
        image_data: {},
        sentBug: false,
        full_screen: false
    }

    sendBug = async () => {
        if (this.state.bugInfo.length > 0) {

            let apiName = 'Openclique';
            let path = '/bugs'
            let myInit = {
                body: {
                    "info": this.state.bugInfo,
                    "image": this.state.image_data,
                    "type": this.props.navigation.state.params.bugType,
                    "username": this.props.navigation.state.params.username
                }
            }

            let response = await API.post(apiName, path, myInit)
            console.log("response:")
            console.log(response)
            this.setState({
                ...this.state,
                sentBug: true
            })
        } else {
            alert("Please tell us what happened before submitting!")
        }
    }

    _pickImage = () => {
        launchImageLibrary({}, (image_data) => {
            this.setState({
                ...this.state,
                image_data: image_data
            })
        })
    }

    render() {
        if (this.state.sentBug) {
            return (
                <View
                style={{flex: 1, backgroundColor: "#EDF1F2"}}
                >
                    <SafeAreaView
                        style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}
                    >
                        <View style={{ flex: 9, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: appColor, fontWeight: "600", fontSize: 22, marginBottom: 8 }}>Thank you!</Text>
                            <Text style={{ fontSize: 14, fontWeight: "600", textAlign: 'center' }}>We are working to fix this bug.</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={() => { this.props.navigation.navigate("Map") }}
                                style={{ width: 300, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: appColor }}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>Back to map</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View> 
            )
        } else if (this.state.full_screen) {
            return (
                <View
                style={{position: 'relative', flex: 1}}
                >
                    <Image
                    style={{ maxHeight: height - 30, maxWidth: width, height: this.state.image_data.height, width: this.state.image_data.width, borderRadius: 10 }}
                    source={{uri: this.state.image_data.uri}}
                    />
                    <TouchableOpacity
                    style={{position: "absolute", top: 45, right: 10, width: 25, height: 25, borderRadius: 15, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}
                    onPress={() => this.setState({ ...this.state, full_screen: false })}
                    >
                        <Text style={{color: "black", fontSize: 18, bottom: 1}}>x</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{flex: 1, backgroundColor: "#EDF1F2"}}>
                    <SafeAreaView
                    style={{ flex: 1, alignItems: 'center', height: "100%"}}
                    >
                        <View style={{flexDirection: "row", alignItems: 'center', marginBottom: 30}}>
                            <View style={{flex: 1, alignItems: "flex-start"}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.goBack()}
                                    style={{ margin: 15}}
                                >
                                    <Image
                                        source={require("../../Images/back_icon.png")}
                                        style={{ width: 16, height: 10, marginLeft: 5, transform: [{ rotate: "90deg" }] }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 2, alignItems: 'center'}}>
                                <Text style={{fontSize: 22, fontWeight: "600"}}>Bug</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <Text style={{fontWeight: "600"}}>Where did you find the problem?</Text>
                        <KeyboardAvoidingView
                        style={{flex: 1, marginTop: 5}}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={100}
                        >
                            <ScrollView
                            style={{flex: 1, width: "100%"}}
                            contentContainerStyle={{alignItems: 'center'}}
                            showsVerticalScrollIndicator={false}
                            >
                                <View style={{width: "100%", alignItems: 'center'}}>
                                    <TextInput
                                    style={{minHeight: 150, width: 300, borderRadius: 15, padding: 10, marginTop: 15, marginBottom: 15, backgroundColor: "white"}}
                                    placeholder="Please tell us what happened? The more detail, the better!"
                                    onChangeText={(text) => this.setState({ bugInfo: text }) }
                                    textAlignVertical="top"
                                    multiline={true}
                                    autoCorrect={false}
                                    />
                                    {
                                        Object.keys(this.state.image_data).length > 0 ?
                                            <View
                                            style={{position: 'relative'}}
                                            >
                                                <TouchableOpacity
                                                onPress={() => this.setState({ ...this.state, full_screen: true })}
                                                >
                                                    <Image
                                                    style={{ maxHeight: 500, maxWidth: 350, height: this.state.image_data.height, width: this.state.image_data.width, borderRadius: 10 }}
                                                    source={{uri: this.state.image_data.uri}}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                style={{position: "absolute", top: 4, right: 4, width: 25, height: 25, borderRadius: 15, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}
                                                onPress={() => this.setState({ ...this.state, image_data: {} })}
                                                >
                                                    <Text style={{color: "black", fontSize: 18, bottom: 1}}>x</Text>
                                                </TouchableOpacity>
                                            </View>
                                        :
                                            <TouchableOpacity
                                            style={{flexDirection: "row", alignItems: 'center', height: 50, width: 300, borderRadius: 30, padding: 10, backgroundColor: "white"}}
                                            onPress={() => this._pickImage()}
                                            >
                                                <Image source={require("../../Images/add_media_status_black.png")} style={{marginRight: 15, marginLeft: 25}}/>
                                                <Text>Add attachment</Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                                <View style={{alignItems: 'center', marginVertical: 15}}>
                                    <TouchableOpacity
                                    onPress={() => this.sendBug()}
                                    style={[styles.submit_button, { backgroundColor: this.state.bugInfo.length > 0 ? appColor : "lightgray", width: 300, height: 50, borderRadius: 30}]}
                                    >
                                        <Text style={{color: "white"}}>Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    submit_button: {
        alignItems: 'center',
        justifyContent: 'center',
    } 
 });