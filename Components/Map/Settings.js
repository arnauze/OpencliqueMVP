import React from 'react'
import { Button, View, Switch, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Auth, API } from 'aws-amplify'
import { connect } from 'react-redux'
import { appColor, almostWhite } from '../../Styles/styles'

class Settings extends React.Component {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#EDF1F2"}}>
                <SafeAreaView
                style={{flex: 1}}
                >
                    <View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
                        <TouchableOpacity
                        style={{marginLeft: 10, flex: 1}}
                        onPress={() => this.props.navigation.goBack()}
                        >
                            <Image
                                source={require("../../Images/back_icon.png")}
                                style={{ width: 16, height: 10, marginLeft: 5, transform: [{ rotate: "90deg" }] }}
                            />
                        </TouchableOpacity>
                        <View style={{alignItems: 'center', flex: 1, alignItems: "center"}}>
                            <Text style={{fontSize: 22, fontWeight: "600"}}>Settings</Text>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                    <View
                    style={{flex: 10, justifyContent: "flex-start", alignItems: 'center'}}
                    >
                        <TouchableOpacity
                        style={{height: 50, width: 300, margin: 10, borderRadius: 30, justifyContent: 'center', backgroundColor: almostWhite, padding: 16, alignItems: 'center'}}
                        onPress={() => this.props.navigation.navigate("BugsReport", {username: this.props.user.info.username})}
                        >
                            <Text style={{fontWeight: "600"}}>I spotted a bug</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => Auth.signOut({global: true})
                            .then(this.props.dispatch({type: 'CHANGE_CONNECTED_USER'}))
                            .catch(err => console.log(err))
                        }
                        style={{height: 50, width: 300, margin: 10, borderRadius: 30, justifyContent: 'center', backgroundColor: almostWhite, padding: 16, alignItems: 'center'}}
                        >
                            <Text style={{fontWeight: "600", color: appColor}}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Settings)