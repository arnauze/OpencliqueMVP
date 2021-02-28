import React from 'react'
import { View, Text } from 'react-native'
import {connect} from 'react-redux'
import { API } from 'aws-amplify';
import SearchItem from '../Shared/SearchItem'

class ListUsers extends React.Component {

    state = {
        usersList: []
    }

    componentWillMount() {

        let apiName = 'Openclique'
        let myInit = {}

        const item = this.props.navigation.state.params.item
        const type = this.props.navigation.state.params.type

        if (type === 'participating') {

            item.guests.participating.map(item => {
                var path = '/users/' + item
                API.get(apiName, path, myInit)
                .then(response => {
                    this.setState({
                        ...this.state,
                        usersList: [...this.state.usersList, response.Item]
                    })
                })
                .catch(error => {
                    console.log(error.response)
                })
            })

        } else if (type === 'invited') {

            item.guests.invited.map(item => {
                var path = '/users/' + item
                API.get(apiName, path, myInit)
                .then(response => {
                    this.setState({
                        ...this.state,
                        usersList: [...this.state.usersList, response.Item]
                    })
                })
                .catch(error => {
                    console.log(error.response)
                })
            })

        }     
    }

    render() {
        return (
            this.state.usersList.map((item, index) => (
                item.username === this.props.user.info.username ? 
                <Text key={index}>You</Text>
                :
                <SearchItem
                navigation={this.props.navigation}
                item={item}
                connected_user={this.props.user.info}
                key={index}
                />  
            ))
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ListUsers)