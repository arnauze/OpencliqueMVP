import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { appColor } from '../../Styles/styles';
import { getBrackets } from '../Functions/functions'

export default class InviteFriends extends React.Component {

    state = {
        selected: []
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Invite Friends'
        }
    }

    _handleUserSelected = (user) => {

        // Function called when I click on one of the nearby user being outputted

        if (this.state.selected.findIndex(item => item.username === user.username) >= 0) {

            // If the user was already chosen then I unchoose him

            var newUserSelected = this.state.selected.filter(item => item.username != user.username) 

            this.setState({
                ...this.state,
                selected: newUserSelected
            })

        } else {

            // If the user hadn't been chosen, then I choose him

            this.setState({
                ...this.state,
                selected: [...this.state.selected, user]
            })

        }

    }

    onDone = friends => {

        this.props.navigation.state.params.onDone(friends)
        this.props.navigation.goBack()

    }

    render() {

        console.log(this.props)
        var props = this.props.navigation.state.params

        return (
            <SafeAreaView style={{flex: 1}}>
                <ScrollView
                style={{flex: 9}}
                stickyHeaderIndices={[0]}
                alwaysBounceVertical={false}
                >
                    <View style={{flexDirection: 'row', height: 60}}></View>
                    {
                        props.friends.map((item, index) => {
                            return (
                                <TouchableOpacity
                                key={index}
                                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 5}}
                                onPress={() => this._handleUserSelected(item)}
                                >
                                    <View>
                                        <Text>{item.full_name}</Text>
                                        <Text>{getBrackets(item.cliquepoints)}</Text>
                                    </View>
                                    <View style={{borderColor: appColor, borderWidth: 1, borderRadius: 10, width: 20, height: 20, backgroundColor: this.state.selected.findIndex(i => i.username === item.username) >= 0 ? appColor : 'white'}}/>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                    <TouchableOpacity
                    style={{width: '100%', height: 40, backgroundColor: appColor, justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => props.onDone(this.state.selected)}
                    >
                        <Text style={{color: 'white', fontWeight: '500'}}>Done ({this.state.selected.length})</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

}