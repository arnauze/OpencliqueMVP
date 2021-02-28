import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { appColor } from '../../Styles/styles';
import { Auth, API } from 'aws-amplify'

export default class MainPage extends React.Component {

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: appColor}}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../../Images/MapIcons/logo_white.png')} style={{width: 73, height: 74}}/>
                    <Image source={require('../../Images/openclique_title_white.png')} style={{margin: 10}}/>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%'}}>
                    <TouchableOpacity
                    style={{width: '90%', height: 80, backgroundColor: appColor, margin: 20, borderWidth: 1, borderColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}
                    onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                        <Text style={{color: "white", fontSize: 17, fontWeight: '500'}}>LOG IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: '90%', height: 80, backgroundColor: "white", margin: 20, borderWidth: 1, borderColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    >
                        <Text style={{color: appColor, fontSize: 17, fontWeight: '500'}}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}