import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { appColor } from '../../Styles/styles';

export default class LiveUsers extends React.Component {

    _makeList() {
        let ret = [];
        let i = -1;
        while (++i < 3) {
            ret.push(
                <View
                key={i}
                style={{margin: 5, alignItems: 'center'}}
                >
                    <View style={{height: 50, width: 50, borderRadius: 25, backgroundColor: "white", borderWidth: 1, borderColor: appColor}}></View>
                    <Text>Username</Text>
                </View>
            )
        }
        return ret.map(item => item);
    }

    render() {
        return (
            <View style={{margin: 10, marginLeft: 15}}>
                <Text style={{fontWeight: "600"}}>Live</Text>
                <View style={{flexDirection: 'row'}}>
                    {
                        this._makeList()
                    }
                </View>
            </View>
        )
    }
}