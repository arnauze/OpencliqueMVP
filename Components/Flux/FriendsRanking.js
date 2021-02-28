import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { appColor } from '../../Styles/styles';
import Character from '../Character/Character';

export default class FriendsRanking extends React.Component {

    _makeList() {
        let ret = []
        let i = 0
        while (++i <= 5) {
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
                    <Text>{i}</Text>
                </View>
            )
        }
        return ret.map(item => item)
    }

    render() {
        return (
            <View>
                <Text style={{margin: 10, fontWeight: "600", fontSize: 16}}>Friends ranking</Text>
                <ScrollView
                contentContainerStyle={{alignItems: 'center'}}
                horizontal={true}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                >
                    <View
                    style={{margin: 15, alignItems: 'center'}}
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
                        <Text>4</Text>
                    </View>
                    <View
                    style={{ height: "90%", width: 1, backgroundColor: "lightgray" }}
                    />
                    {this._makeList()}
                </ScrollView>
            </View>
        )
    }
}