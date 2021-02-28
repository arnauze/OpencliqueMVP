import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { API } from 'aws-amplify';

class MyEvents extends React.Component {

    constructor(props) {
        super(props)

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/events'
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {
            this.setState({
                events: response.Items
            })
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    render() {

        // I need to work on displaying the list of events

        return (
            this.state ? this.state.events.length > 0 ? this.state.events.map((item, index) => (
                    <TouchableOpacity
                    style={{alignItems: 'center', marginBottom: 10}}
                    key={index}
                    onPress={() => this.props.navigation.navigate('EventDetail', {item:item})}
                    >
                        <Text>{item.event_name}</Text>
                        <Text>{item.type}</Text>
                        <Text>{item.address}</Text>
                        <Text>{item.creator}</Text>
                    </TouchableOpacity>
                )
            ) : <Text>You don't have any events</Text> : <Text>Loading</Text>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(MyEvents)