import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'

export default class RenderFlames extends React.Component {
    // Props:
    //      amount

    _makeFlames() {
        let ret = [];
        var i = -1;
        while (++i < this.props.amount) {
            ret.push(
                <Image
                key={i}
                source={require('../../Images/Flames/black_flame.png')}
                style={{width: 11, height: 15, marginRight: 5}}
                />
            )
        }
        return ret.map((item) => item);
    }

    render() {
        return (
            <View
            style={{flexDirection: 'row', marginRight: 15, alignItems: 'center'}}
            >
                {
                    this._makeFlames()
                }
            </View>
        )
    }
}