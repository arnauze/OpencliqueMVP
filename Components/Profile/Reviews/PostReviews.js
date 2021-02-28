import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ReviewSummary from '../../Shared/ReviewSummary'
import SocialBar from '../../Shared/SocialBar'
import SocialHeader from '../../Shared/SocialHeader'
import { timeDifference } from '../../Functions/functions'

export default class PostReviews extends React.Component {

    render() {

        if (this.props.postReviews.length > 0) {

            return (
                <View>
                    {this.props.postReviews.map((item, index) => {
                        return (
                            <View key={index} style={{borderBottomColor: 'gray', borderBottomWidth: 1}}>
                                <SocialHeader
                                user={this.props.user}
                                navigation={this.props.navigation}
                                timeDifference={timeDifference(Date.now(), item.timestamp)}
                                inFlux={false}
                                item={this.props.item}
                                />
                                <ReviewSummary
                                review={item}
                                // getReview={this._getReview}
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
                        )
                    })}
                </View>
            )

        } else {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Text>No reviews yet</Text>
                </View>
            )
        }

    }

}