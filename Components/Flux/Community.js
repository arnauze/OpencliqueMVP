import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { appColor } from '../../Styles/styles';
import Character from '../Character/Character';

export default class Community extends React.Component {

    _makeTopPlayers() {
        let ret = []
        let i = -1
        while (++i < 3) {
            ret.push(
                <View
                style={{margin: 15, alignItems: 'center'}}
                key={i}
                >
                    <Character
                    disabled={true}
                    navigation={this.props.navigation}
                    isFeed={true}
                    character={this.props.user.character}
                    />
                    <View style={{margin: 5, alignItems: 'center'}}>
                        <Text style={{fontWeight: "600"}}>Maxence</Text>
                        <Text>50</Text>
                    </View>
                </View>
            )
        }
        return ret.map(item => item);
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: "600", fontSize: 16, margin: 10, alignSelf: "flex-start"}}>Openclique 1.0 Community</Text>
                <View style={{flexDirection: "row", alignItems: 'center', margin: 15}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{color: appColor}}>50</Text>
                        <Text style={{color: appColor}}>members</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{color: appColor}}>97</Text>
                        <Text style={{color: appColor}}>items obtained</Text>
                    </View>
                </View>
                <Text style={{ fontWeight: "600", margin: 5 }}>Top members</Text>
                <View style={{ flexDirection: "row", marginLeft: 40, marginRight: 40 }}>
                    {this._makeTopPlayers()}
                </View>
            </View>
        )
    }
}