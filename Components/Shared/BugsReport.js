import React from 'react'
import { SafeAreaView } from 'react-native'
import { Image, Text, TouchableOpacity, ScrollView, TextInput, View, StyleSheet } from 'react-native'
import BackIcon from "./BackIcon"

const CATEGORIES = [
    {
        text: "Map",
        icon: require("../../Images/map_black.png"),
        iconWidth: 30,
        iconHeight: 28
    },
    {
        text: "Feed",
        icon: require("../../Images/suggestions_black.png"),
        iconWidth: 30,
        iconHeight: 32
    },
    {
        text: "Suggestion",
        icon: require("../../Images/community_black.png"),
        iconWidth: 30,
        iconHeight: 30
    },
    {
        text: "Other",
        icon: require("../../Images/error.png"),
        iconWidth: 30,
        iconHeight: 30
    },
]

export default class BugsReport extends React.Component {
    state = {
        page: "main",
        bugType: "",
    }

    static navigationOptions = ({navigation}) => {
        return {
            header: null,
            headerLeft: <BackIcon navigation={navigation}/>
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#EDF1F2"}}>
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView
                    contentContainerStyle={{alignItems: 'center'}}
                    alwaysBounceVertical={false}
                    style={{position: 'relative', top: 0, bottom: 0, left: 0, right: 0, height: "100%"}}
                    >
                        <View style={{flexDirection: "row", alignItems: 'center'}}>
                            <View style={{flex: 1}}>
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
                                <Text style={{fontSize: 22, fontWeight: "600"}}>I spotted a bug</Text>
                            </View>
                            <View style={{flex: 1}}></View>
                        </View>
                        <Text style={{fontSize: 15, margin: 15, marginTop: 30, fontWeight: "400"}}>Where did you find the problem?</Text>
                        {
                            CATEGORIES.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                    style={{width: 300, height: 50, padding: 10, marginTop: 15, borderRadius: 30, backgroundColor: "white", flexDirection: 'row', alignItems: 'center'}}
                                    onPress={() => this.props.navigation.navigate("SendBugReport", { bugType: item.text, username: this.props.navigation.state.params.username })}
                                    key={index}
                                    >
                                        <Image source={item.icon} style={{width: item.iconWidth, height: item.iconHeight, marginRight: 15, marginLeft: 20}}/>
                                        <Text style={{fontWeight: "600"}}>{item.text}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </SafeAreaView>
            </View>
        )
    }
}