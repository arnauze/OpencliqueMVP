import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { appColor } from '../../Styles/styles';

export default class BestItemsObtained extends React.Component {
    _makeList() {
        let ret = [];
        let i = -1;
        while (++i < 4) {
            ret.push(
                <View
                key={i}
                style={{flex: 1, alignItems: 'center'}}
                >
                    <View style={{height: 81, width: 81, borderRadius: 15, backgroundColor: appColor}}></View>
                </View>
            )
        }
        return ret.map(item => item);
    }

    render() {
        return (
            <View style={{margin: 10, marginLeft: 15}}>
                <Text style={{fontWeight: "600", marginBottom: 10}}>Best items obtained</Text>
                <View style={{flexDirection: 'row'}}>
                    {
                        this._makeList()
                    }
                </View>
            </View>
        )
    }
}