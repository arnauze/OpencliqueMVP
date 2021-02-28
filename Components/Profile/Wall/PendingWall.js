import React from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import StatusSummary from '../../Shared/StatusSummary'
import { appColor } from '../../../Styles/styles'
import { API } from 'aws-amplify';
import { connect } from 'react-redux'

class PendingWall extends React.Component {

    state = {
        title: '',
        description: '',
        items: []
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            items: this.props.items
        })
    }

    _onPostStatus = (p) => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.username + '/wall'
        let myInit = {
            body: {
                type: this.state.items[0].type,
                id: this.state.items[0].data.id,
                title: this.state.title,
                desc: this.state.description,
                public: p
            }
        }

        API.post(apiName, path, myInit)
        .then(data => {
            console.log(data)

            // I delete the status from the frontend
            this.setState({ ...this.state, items: this.props.items.filter((item, index) => index !== 0)})

            // I update the global user to get rid of the notification
            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: {
                        ...this.props.user,
                        wall: {
                            ...this.props.user.wall,
                            pending: this.props.user.wall.pending.filter((item, index) => index !== 0 )
                        }
                    }
                }
            }
            this.props.dispatch(action)

            // Then I refresh the wall page
            this.props.refresh()

        })
        .catch(err => {
            console.log(err)
        })

    }

    _onConfirmCancel = () => {

        // First I update the informations locally
        this.setState({ ...this.state, items: this.props.items.filter((item, index) => index !== 0)})

        // And I make an API call to update the backend
        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.username + '/wall/pending'
        let myInit = {}

        API.del(apiName, path, myInit)
        .then(response => {
            console.log(response)
            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: response
                }
            }
            this.props.dispatch(action)
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    onCancel = () => {

        // Function called when the user clicks on the cancel button
        // I output message asking for confirmation if they confirm I delete the message locally and in the databse
        // else I don't do anything
        
        Alert.alert(
            'Delete pending status',
            'Are you sure you want to delete the pending status ?',
            [
                { text: 'Yes', onPress: this._onConfirmCancel },
                { text: 'Cancel'}
            ]
        )

    }

    onPost = () => {

        // Function called when the user clicks on the cancel button
        // I output message asking for confirmation if they confirm I delete the message locally and in the databse
        // else I don't do anything
        
        Alert.alert(
            'Status privacy',
            "Do you want to share this post on the place's wall as well ?",
            [
                { text: 'Yes', onPress: () => this._onPostStatus(true) },
                { text: 'No', onPress: () => this._onPostStatus(false) }
            ]
        )

    }

    _onChangeDescription = (text) => {
        this.setState({
            ...this.state,
            description: text
        })
    }

    _onChangeTitle = (text) => {
        this.setState({
            ...this.state,
            title: text
        })
    }

    render() {

        console.log("[PENDING WALL] We got in here")

        if (this.state && this.state.items.length > 0) {

            return (
                <View>
                    <Text style={{color: appColor, fontWeight: 'bold', margin: 7}}>{this.state.items.length} PENDING POST{this.state.items.length > 1 ? 'S' : null}</Text>
                    <View style={{borderWidth: 3, borderColor: appColor}}>
                        <StatusSummary
                        user={this.props.user}
                        navigation={this.props.navigation}
                        editable={true}
                        status={this.state.items[0]}
                        onCancel={this.onCancel}
                        onChangeDescription={this._onChangeDescription}
                        onChangeTitle={this._onChangeTitle}
                        title={this.state.title}
                        description={this.state.description}
                        onPost={this.onPost}
                        />
                    </View>
                </View>
            )

        } else return null
    }

}

export default connect()(PendingWall)