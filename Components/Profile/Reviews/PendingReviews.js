import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import ReviewPlace from '../../Shared/ReviewPlace'
import { appColor } from '../../../Styles/styles'

export default class PendingReviews extends React.Component {

    render() {

        if (this.props.pendingReviews.length > 0) {

            return (
                <View>
                    <Text style={{color: appColor, fontWeight: 'bold', margin: 7}}>{this.props.pendingReviews.length} PENDING REVIEW{this.props.pendingReviews.length > 1 ? 'S' : null}</Text>
                    <View style={{borderWidth: 3, borderColor: appColor}}>
                        <ReviewPlace
                        place={this.props.pendingReviews[0]}
                        navigation={this.props.navigation}
                        refresh={this.props.refresh}
                        user={this.props.user}
                        onCancel={this.props.onCancel}
                        />
                    </View>
                </View>
            )

        } else {

            return null

        }

    }
}