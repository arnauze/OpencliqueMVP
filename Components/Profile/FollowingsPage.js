import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { API } from 'aws-amplify';
import SearchItem from '../Shared/SearchItem'
import { connect } from 'react-redux'

class FollowingsPage extends React.Component {

    state = {
        loading: true
    }

    _getFollowings = () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/followings'
        let myInit = {
            body: this.props.navigation.state.params.user.followings.filter(item => item != 0)
        }

        API.get(apiName, path, myInit)
        .then(response => {

            console.log(response)

            this.setState({
                loading: false,
                followings: response
            })
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    componentWillMount() {

        this._getFollowings()
        
    }

    render() {

        if (this.state.loading) {

            return (

                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" />
                </View>

            )

        } else {

            return (

                this.state ? this.state.followings.map((item, index) => (
                    <SearchItem item={item} connected_user={this.props.user.info} key={index} navigation={this.props.navigation}/>
                )) : null

            )

        }

    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(FollowingsPage)