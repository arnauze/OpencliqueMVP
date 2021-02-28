import React from 'react'
import ReviewSummary from './ReviewSummary'
import SocialHeader from './SocialHeader'
import SocialBar from './SocialBar'
import { API } from 'aws-amplify'
import { Text, View } from 'react-native'
import { timeDifference } from '../Functions/functions'

function compare(a, b) {

    if (a.timestamp < b.timestamp) {

        return 1

    } else {
        
        return -1
        
    }

}

export default class Reviews extends React.Component {

    componentWillMount() {

        this._getReviews()

    }

    _getReviews = () => {

        let apiName = 'Openclique'
        let path = '/reviews/place/' + this.props.place.id
        let myInit = {}

        API.get(apiName, path, myInit).then(response => {

            console.log("[PLACE REVIEWS] API RETURN: ", response)
            this.setState({
                ...this.state,
                reviews: response,
                loading: false
            })

        }).catch(error => {

            console.log(error.response)

        })
    }

    render() {

        console.log(this.props)

        if (this.state && this.state.reviews.length > 0) {
            return (
                this.state.reviews.map((item, index) => (
                    <View key={index}>
                        <SocialHeader
                        user={this.props.user}
                        navigation={this.props.navigation}
                        timeDifference={timeDifference(Date.now(), item.timestamp)}
                        inFlux={false}
                        item={this.props.item}
                        />
                        <ReviewSummary
                        review={ { ...item, place_info: this.props.place } }
                        // getReview={this._getReviews}
                        navigation={this.props.navigation}
                        />
                        <SocialBar
                        navigation={this.props.navigation}
                        item={item.social}
                        user={item.user_id}
                        item_id={item.id}
                        full_item={item}
                        typeOfPost={"review"}
                        />
                    </View>
                ))
            )
        } else if (this.state && this.state.reviews.length == 0){
            return (
                <View style={{ height: 1000, alignItems: 'center' }}>
                    <Text>No reviews yet</Text>
                </View>
            )
        } else {
            return (
                <View style={{ height: 1000, alignItems: 'center' }}>
                    <Text>Loading</Text>
                </View>
            )
        }
    }
}