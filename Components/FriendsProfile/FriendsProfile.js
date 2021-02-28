import React from 'react'
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import CharacterInformations from '../Profile/CharacterInformations'
import { API } from 'aws-amplify'
import ProgressBar from '../Profile/ProgressBar'
import { getLevelPoints } from '../Functions/functions'
import MostVisitedPlaces from '../Profile/MostVisitedPlaces'
import CurrentStatus from '../Shared/CurrentStatus';
import FriendProfileButton from './FriendProfileButton';

class Profile extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        if (params) {
            return {
                headerTitle: <Text style={{fontSize: 18, fontWeight: "600"}}>{params.user.first_name}</Text>,
                headerRight: params.isFriend ? <FriendProfileButton /> : null
            }
        }
    }

    state = {
        user: {},
        loading: true
    }


    componentWillMount() {

        // Right now followers don't update for some reason
        // Maybe because setState is asynchronous 

        this.props.navigation.setParams({
            user: this.props.navigation.state.params.user,
            isFriend: (this.props.navigation.state.params.user.followers.indexOf(this.props.user.info.username) >= 0)
        });

        let action = { type: 'CHANGE_OPEN_TAB', value: 'Wall' }
        this.props.dispatch(action)

        let apiName = "Openclique"
        let path = "/users/" + this.props.navigation.state.params.user.username
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {
            this.setState({
                user: response.Item,
                loading: false
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    componentWillUnmount() {
        let action = { type: 'CHANGE_OPEN_TAB', value: 'Wall' }
        this.props.dispatch(action)
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#F2994A" />
                </View>
            )
        } else {

            var cliquepoints = this.state.user.cliquepoints;
            var minPoints = cliquepoints - getLevelPoints(cliquepoints, "previous");
            var maxPoints = getLevelPoints(cliquepoints, "next") - getLevelPoints(cliquepoints, "previous");

            return (
                <React.Fragment>
                    <ScrollView 
                    >
                        <CharacterInformations navigation={this.props.navigation} user={this.props.user.info} profileType="Friend"/>
                        <ProgressBar cliquepoints={cliquepoints} minPoints={minPoints} maxPoints={maxPoints}/>
                        <CurrentStatus place="901 Bar & Grill" flames={[0,1,2,3,4]} />
                        <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ItemsCollection')}
                        style={{flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'center'}}
                        >
                            <Text style={{fontSize: 25, color: 'red'}}>22 </Text>
                            <Text style={{color: "red"}}>DIFFERENT ITEMS</Text>
                        </TouchableOpacity>
                        {/* If user is in friends list show MostVisitedPlaces, else show Add friend / Cancel request */}
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                            <MostVisitedPlaces />
                        </View>
                    </ScrollView>
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        openTab: state.openTab,
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)