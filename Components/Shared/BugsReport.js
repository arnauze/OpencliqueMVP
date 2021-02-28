import React from 'react'
import { Image, Text, TouchableOpacity, ScrollView, TextInput, View, StyleSheet } from 'react-native'
import BackIcon from "./BackIcon"

const CATEGORIES = [
    {
        text: "Map",
        icon: require("../../Images/NavigationBar/map.png"),
        iconWidth: 20,
        iconHeight: 29
    },
    // {
    //     text: "Friends",
    //     icon: require("../../Images/friends.png"),
    //     iconWidth: 20,
    //     iconHeight: 15
    // },
    // {
    //     text: "Status",
    //     icon: require("../../Images/logo_black.png"),
    //     iconWidth: 19,
    //     iconHeight: 20
    // },
    // {
    //     text: "Feed",
    //     icon: require("../../Images/NavigationBar/flux.png"),
    //     iconWidth: 20,
    //     iconHeight: 20
    // },
    // {
    //     text: "Rewards",
    //     icon: require("../../Images/NavigationBar/map.png"),
    //     iconWidth: 20,
    //     iconHeight: 29
    // },
    // {
    //     text: "Profile",
    //     icon: require("../../Images/NavigationBar/profile.png"),
    //     iconWidth: 20,
    //     iconHeight: 20
    // },
    {
        text: "Suggestions",
        icon: require("../../Images/logo_black.png"),
        iconWidth: 20,
        iconHeight: 20
    },
    {
        text: "Settings",
        icon: require("../../Images/bug_settings.png"),
        iconWidth: 19.5,
        iconHeight: 20
    },
    {
        text: "Other",
        icon: null,
        iconWidth: 19.5,
        iconHeight: 20
    },
    // {
    //     text: "Community",
    //     icon: require("../../Images/NavigationBar/map.png"),
    //     iconWidth: 20,
    //     iconHeight: 29
    // },
    // {
    //     text: "Other",
    //     icon: require("../../Images/NavigationBar/map.png"),
    //     iconWidth: 20,
    //     iconHeight: 29
    // },
]

export default class BugsReport extends React.Component {
    state = {
        page: "main",
        bugType: "",
    }

    static navigationOptions = ({navigation}) => {
        return {
            headerLeft: <BackIcon navigation={navigation}/>
        }
    }

    render() {
        return (
            <ScrollView
            contentContainerStyle={{alignItems: 'center'}}
            alwaysBounceVertical={false}
            style={{position: 'relative', top: 0, bottom: 0, left: 0, right: 0, height: "100%"}}
            >
                <Text style={{fontSize: 15, margin: 10}}>Where did you find a problem?</Text>
                {
                    CATEGORIES.map((item, index) => {
                        return (
                            <TouchableOpacity
                            style={{width: "92%", height: 50, padding: 10, marginTop: 10, borderRadius: 15, backgroundColor: "rgba(0,0,0,0.03)", flexDirection: 'row', alignItems: 'center'}}
                            onPress={() => this.props.navigation.navigate("SendBugReport", { bugType: item.text, username: this.props.navigation.state.params.username })}
                            key={index}
                            >
                                <Image source={item.icon} style={{width: item.iconWidth, height: item.iconHeight, marginRight: 15}}/>
                                <Text style={{fontWeight: "600"}}>{item.text}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
        )
    }
}