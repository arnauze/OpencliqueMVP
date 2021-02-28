import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import SearchItem from '../Shared/SearchItem'
import { connect } from 'react-redux'
import { API } from 'aws-amplify';

class FollowersPage extends React.Component {

    state = {
        loading: true
    }

    _getFollowers = () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/followers'
        let myInit = {
            body: this.props.navigation.state.params.user.followers.filter(item => item != 0)
        }

        API.get(apiName, path, myInit)
        .then(response => {

            console.log(response)

            this.setState({
                loading: false,
                followers: response
            })
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    componentWillMount() {

        this._getFollowers()

    }

    render() {

        if (this.state.loading) {

            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )

        } else {

            return (
                this.state.followers.map((item, index) => (
                    <SearchItem item={item} connected_user={this.props.user.info} key={index} navigation={this.props.navigation}/>
                ))
            )

        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(FollowersPage)