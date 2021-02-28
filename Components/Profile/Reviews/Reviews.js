import React from 'react'
import { API } from 'aws-amplify';
import { Text, View, ActivityIndicator, ScrollView, Alert } from 'react-native'
import PendingReviews from './PendingReviews'
import PostReviews from './PostReviews'
import { connect } from 'react-redux'

class Reviews extends React.Component {


    state = {
        loading: true,
        reviews: {}
    }

    componentDidMount() {
        this._getReviews()
    }

    _getReviews = async () => {
        console.log("[REVIEWS] GETTING REVIEWS:")
        let apiName = 'Openclique'
        let path = '/reviews/user/' + this.props.user.username
        let myInit = {}

        try {
            var response = await API.get(apiName, path, myInit)
        } catch (e) {
            alert("There was a problem loading your reviews. Try again")
            console.log(e)
        }
        console.log("[REVIEWS] ", response)

        this.setState({
            reviews: response,
            loading: false
        })
    }

    hasReviews = () => {
        return (this.state.reviews.pending.length > 0 || this.state.reviews.post.length > 0)
    }

    onCancel = () => {
        Alert.alert(
            'Delete review',
            'Are you sure you want to delete the pending review ? (You will not earn any CP)',
            [
                { text: 'Yes', onPress: this._onConfirmCancel },
                { text: 'Cancel'}
            ]
        )
    }

    _onConfirmCancel = () => {

        // Function called when a user doesn't want to share a review

        // First I update the pending reviews locally
        this.setState({
            ...this.state,
            reviews: {
                ...this.state.reviews,
                pending: this.state.reviews.pending.filter((item, index) => index !== 0)
            },
            loading: true
        })

        // this._getReviews()

        // Then I update the database
        let apiName = 'Openclique'
        let path = '/reviews/user/' + this.props.user.username + '/pending'
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

    render() {
        
        if (this.state.loading) {
            this._getReviews()
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )

        } else {
        
            return (

                <ScrollView>
                    {
                        this.props.isFriend ? null : 
                        <PendingReviews
                        pendingReviews={this.state.reviews.pending}
                        navigation={this.props.navigation}
                        refresh={this._getReviews}
                        user={this.props.user}
                        onCancel={this.onCancel}
                        />
                    }
                    <PostReviews
                    postReviews={this.state.reviews.post}
                    navigation={this.props.navigation}
                    update={this.updateComponent}
                    user={this.props.user}
                    />
                </ScrollView>

            )

        }
        
    }
}


export default connect()(Reviews)