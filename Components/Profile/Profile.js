import React from 'react'
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import CharacterInformations from './CharacterInformations'
import { API } from 'aws-amplify'
import ProgressBar from './ProgressBar'
import { getLevelPoints } from '../Functions/functions'
import MostVisitedPlaces from './MostVisitedPlaces'
import FriendsListButton from '../Shared/FriendsListButton';
import CurrentStatus from '../Shared/CurrentStatus';

class Profile extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        if (params) {
            return {
                headerTitle: <Text style={{fontSize: 18, fontWeight: "600"}}>{params.user.info.first_name}</Text>,
                headerRight: <FriendsListButton navigation={navigation} />
            }
        }
    }

    state = {
        user: {},
        loading: true
    }

    _getUsers = () => {

        let apiName = "Openclique"
        let path = "/users/" + this.props.user.info.username
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {
            this.setState({
                user: response.Item,
                loading: false
            }, () => {
                let action = {
                    type: "UPDATE_USER",
                    value: {
                        full: true,
                        user: this.state.user
                    }
                }
                this.props.dispatch(action)
            })
        })
        .catch(error => {
            console.log(error)
        })

    }

    componentWillMount() {

        this.props.navigation.setParams({
            user: this.props.user
        });

    }

    componentWillUnmount() {
        let action = { type: 'CHANGE_OPEN_TAB', value: 'Wall' }
        this.props.dispatch(action)
    }

    _reload = () => {
        this.setState({
            ...this.state,
            loading: true
        })
    }

    render() {

        if (this.state.loading) {

            this._getUsers()

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
                        <CharacterInformations navigation={this.props.navigation} user={this.props.user} profileType="User"/>
                        <ProgressBar cliquepoints={cliquepoints} minPoints={minPoints} maxPoints={maxPoints}/>
                        <CurrentStatus place="901 Bar & Grill" flames={[0,1,2,3,4]} />
                        <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ItemsCollection', { user: this.props.user })}
                        style={{flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'center'}}
                        >
                            <Text style={{fontSize: 25, color: 'red'}}>22 </Text>
                            <Text style={{color: "red"}}>DIFFERENT ITEMS</Text>
                        </TouchableOpacity>
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