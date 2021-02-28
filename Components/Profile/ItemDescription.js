import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { getRarityColor } from '../Functions/functions';
import { appColor } from '../../Styles/styles';

export default class ItemDescription extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        const item = params.item
        return {
            headerTitle: <Text style={{fontSize: 18, fontWeight: "600", color: getRarityColor(item)}}>{item.name}</Text>
        }
    }

    _makeDroppedLocations = () => {
        let ret = []
        let i = -1;
        while (++i < 4) {
            ret.push(
                <TouchableOpacity
                style={{margin: 5, borderRadius: 15, width: "90%", height: 50, justifyContent: 'center', padding: 10, margin: 7, backgroundColor: "rgba(161,161,161,0.2)"}}
                key={i}
                >
                    <Text style={{fontWeight: '600'}}>Urth Café -<Text style={{fontWeight: "normal"}}> Los Angeles, CA</Text></Text>
                    <Text>12/02/2021</Text>
                </TouchableOpacity>
            )
        }
        return ret.map(item => item)
    }

    render() {
        var item = this.props.navigation.state.params.item
        return (
            <React.Fragment>
                <View
                style={{ alignItems: 'center', margin: 7, flex: 1}}
                >
                    <View style={{flex: 1}}>
                        <Text style={{color: getRarityColor(item), fontSize: 17}}>{item.rarity} item</Text>
                    </View>
                    <View style={{flex: 2, margin: 40, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{height: 50, width: 72, borderWidth: 1, marginBottom: 20}}/>
                        <Text style={{fontWeight: "600"}}>ITEM ID</Text>
                    </View>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <Text style={{color: appColor, fontWeight: "500"}}>90.3% of players obtained this item</Text>
                    </View>
                </View>
                <View style={{height: 1, width: "85%", backgroundColor: "lightgray", margin: 10}}/>
                <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                alwaysBounceVertical={false}
                >
                    <Text style={{fontWeight: "600", marginBottom: 5}}>Obtained 4 times</Text>
                    {
                        this._makeDroppedLocations()
                    }
                </ScrollView>
            </React.Fragment>
        )
    }
}