import React from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { appColor } from '../../Styles/styles';
import BackIcon from "./BackIcon"
import { API } from 'aws-amplify'
import { launchImageLibrary } from 'react-native-image-picker';

export default class SendBugReport extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <BackIcon navigation={navigation}/>
        }
    }

    state = {
        bugInfo: "",
        image_data: {}
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
            this.props.navigation.navigate("Map")

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
        return (
            <SafeAreaView
            style={{ alignItems: 'center', height: "100%"}}
            >
                <KeyboardAvoidingView
                style={{flex: 1}}
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
                            style={{minHeight: 150, width: "92%", borderRadius: 15, borderWidth: 1, borderColor: "lightgray", padding: 10, marginTop: 15, marginBottom: 15}}
                            placeholder="Tell us what happened. The more detail, the better!"
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
                                        <Image
                                        style={{ maxHeight: 500, maxWidth: 350, height: this.state.image_data.height, width: this.state.image_data.width, borderRadius: 10 }}
                                        source={{uri: this.state.image_data.uri}}
                                        />
                                        <TouchableOpacity
                                        style={{position: "absolute", top: 4, right: 4, width: 25, height: 25, borderRadius: 15, backgroundColor: "lightgray", alignItems: "center", justifyContent: "center"}}
                                        onPress={() => this.setState({ ...this.state, image_data: {} })}
                                        >
                                            <Text style={{color: "black", fontSize: 18, bottom: 1}}>x</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <TouchableOpacity
                                    style={{flexDirection: "row", alignItems: 'center', height: 50, width: "92%", borderRadius: 15, padding: 10, backgroundColor: "rgba(0,0,0,0.03)"}}
                                    onPress={() => this._pickImage()}
                                    >
                                        <Image source={require("../../Images/add_media_status_black.png")} style={{marginRight: 15}}/>
                                        <Text>Add attachment</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={{alignItems: 'center', marginVertical: 15}}>
                            <TouchableOpacity
                            onPress={() => this.sendBug()}
                            style={[styles.submit_button, { backgroundColor: this.state.bugInfo.length > 0 ? appColor : "lightgray", }]}
                            >
                                <Text style={{color: "white"}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    } 
 });