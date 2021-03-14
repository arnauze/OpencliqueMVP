import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { appColor } from '../../Styles/styles';
import { Auth, API } from 'aws-amplify'

export default class MainPage extends React.Component {

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F2788C"}}>
                <View style={{flex: 9, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../../Images/MapIcons/logo_white.png')} style={{width: 73, height: 74}}/>
                    <Text style={{fontWeight: "500", fontSize: 44, color: "white", marginTop: 10}}>openclique</Text>
                </View>
                <View style={{flex: 3, alignItems: 'center', justifyContent: 'flex-start', width: '100%'}}>
                    <TouchableOpacity
                    style={{width: '50%', height: 40, backgroundColor: "#F2788C", marginBottom: 10, borderWidth: 1, borderColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}
                    onPress={() => this.props.navigation.navigate('SignIn')}
                    >
                        <Text style={{color: "white", fontSize: 17, fontWeight: '500'}}>SIGN IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={{width: '50%', height: 40, backgroundColor: "white", borderWidth: 1, borderColor: 'white', alignItems: 'center', justifyContent: 'center', borderRadius: 15}}
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    >
                        <Text style={{color: appColor, fontSize: 17, fontWeight: '500'}}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}