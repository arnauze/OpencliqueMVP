import React from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native'
import { appColor } from '../../Styles/styles';
import BackIcon from "./BackIcon"
import { API } from 'aws-amplify'

export default class SendBugReport extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <BackIcon navigation={navigation}/>
        }
    }

    state = {
        bugInfo: ""
    }

    sendBug = async () => {
        if (this.state.bugInfo.length > 0) {

            let apiName = 'Openclique';
            let path = '/bugs'
            let myInit = {
                body: {
                    "info": this.state.bugInfo,
                    "type": this.props.navigation.state.params.bugType,
                    "username": this.props.navigation.state.params.username
                }
            }

            let response = await API.post(apiName, path, myInit)
            console.log("response:")
            console.log(response)
            this.props.navigation.navigate("Map")

        } else {
            alert("Please tell us what happened before submitting!")
        }
    }

    render() {
        return (
            <SafeAreaView
            style={{ alignItems: 'center', height: "100%"}}
            >
                <KeyboardAvoidingView
                style={{flex: 1, alignItems: 'center', width: "100%"}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={100}
                >
                    <View style={{flex: 9, width: "100%", alignItems: 'center'}}>
                        <TextInput
                        style={{minHeight: 150, width: "92%", borderRadius: 15, borderWidth: 1, borderColor: "lightgray", padding: 10, marginTop: 15, marginBottom: 15}}
                        placeholder="Tell us what happened. The more detail, the better!"
                        onChangeText={(text) => this.setState({ bugInfo: text }) }
                        textAlignVertical="top"
                        multiline={true}
                        autoCorrect={false}
                        />
                        <TouchableOpacity
                        style={{flexDirection: "row", alignItems: 'center', height: 50, width: "92%", borderRadius: 15, padding: 10, backgroundColor: "rgba(0,0,0,0.03)"}}
                        >
                            <Image source={require("../../Images/add_media_status_black.png")} style={{marginRight: 15}}/>
                            <Text>Add attachment</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                        <TouchableOpacity
                        onPress={() => this.sendBug()}
                        style={[styles.submit_button, { backgroundColor: this.state.bugInfo.length > 0 ? appColor : "lightgray", }]}
                        >
                            <Text style={{color: "white"}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    submit_button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,
        borderRadius: 15,
        // position: "absolute",
        // bottom: 30
    } 
 });