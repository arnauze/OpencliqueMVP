import React from 'react'
import { Button, View, Switch, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Auth, API } from 'aws-amplify'
import { connect } from 'react-redux'
import { appColor, almostWhite } from '../../Styles/styles'
import { TransitionPresets } from 'react-navigation';

class Filters extends React.Component {

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "#EDF1F2"}}>
                <SafeAreaView
                style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                >
                    <Text>Hey</Text>
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

export default connect(mapStateToProps)(Filters)