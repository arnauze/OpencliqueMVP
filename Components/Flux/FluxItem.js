import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import ReviewSummary from '../Shared/ReviewSummary'
import { API } from 'aws-amplify';
import PostItem from './FluxItemComponents/PostItem'
import LocationItem from './FluxItemComponents/LocationItem'
import EventItem from './FluxItemComponents/EventItem'
import BookingItem from './FluxItemComponents/BookingItem'
import SocialBar from '../Shared/SocialBar'
import StatusSummary from '../Shared/StatusSummary'
import SocialHeader from '../Shared/SocialHeader';
import { timeDifference } from '../Functions/functions';

export default class FluxItem extends React.Component {

    _outputFluxItems() {

        // Function that returns the right component depending on the type of flux item

        if (this.props.item.flux_type.type === 'review') {
            return (
                <React.Fragment>
                    <SocialHeader
                    user={this.props.user}
                    navigation={this.props.navigation}
                    timeDifference={timeDifference(Date.now(), this.props.item.flux_type.data.timestamp)}
                    inFlux={true}
                    item={this.props.item}
                    />
                    <ReviewSummary
                    review={this.props.item.flux_type.data}
                    // getReview={this._getReview}
                    navigation={this.props.navigation}
                    />
                    <SocialBar
                    navigation={this.props.navigation}
                    item={this.props.item.flux_type.data.social}
                    user={this.props.item.user_id}
                    item_id={this.props.item.id}
                    full_item={this.props.item.flux_type.data}
                    typeOfPost={this.props.item.flux_type.type}
                    />
                </React.Fragment>
            )
        } else if (this.props.item.flux_type.type === 'post') {
            return(
                <PostItem item={this.props.item}/>
            )
        } else if (this.props.item.flux_type.type === 'location') {
            return (
                <LocationItem item={this.props.item}/>
            )
        } else if (this.props.item.flux_type.type === 'event') {
            return (
                <React.Fragment>
                    <EventItem
                    item={this.props.item.flux_type.data}
                    flux={this.props.item}
                    navigation={this.props.navigation}
                    />
                    <SocialBar
                    navigation={this.props.navigation}
                    item={this.props.item.flux_type.data.social}
                    user={this.props.item.user_id}
                    item_id={this.props.item.id}
                    full_item={this.props.item.flux_type.data}
                    typeOfPost={this.props.item.flux_type.type}
                    />
                </React.Fragment>
            )
            
        } else if (this.props.item.flux_type.type === 'booking') {
            return (
                <BookingItem
                item={this.props.item}
                navigation={this.props.navigation}
                />
            )
        } else if (this.props.item.flux_type.type === 'status') {
            return (
                <React.Fragment>
                    <SocialHeader
                    user={this.props.user}
                    navigation={this.props.navigation}
                    timeDifference={timeDifference(Date.now(), this.props.item.timestamp)}
                    inFlux={true}
                    item={this.props.item}
                    />
                    <StatusSummary
                    editable={false}
                    status={{type: "status", data: this.props.item.flux_type.data}}
                    title={this.props.item.flux_type.data.title}
                    description={this.props.item.flux_type.data.description}
                    />
                    <SocialBar
                    navigation={this.props.navigation}
                    item={this.props.item.flux_type.data.social}
                    user={this.props.item.user_id}
                    item_id={this.props.item.id}
                    full_item={this.props.item.flux_type.data}
                    typeOfPost={this.props.item.flux_type.type}
                    />
                </React.Fragment>
            )
        }

    }

    render() {

        // Here I'm using a little trick to avoid outputing the InformationBar component when I'm outputting a review
        // because it's already included

        console.log("[FLUX ITEM] props: ", this.props)
        console.log("[FLUX ITEM] state: ", this.state)

        return (
            <View style={styles.main_container}>
                <View style={styles.item}>
                    {this._outputFluxItems()}
                    {
                        this.props.item.flux_type.type !== 'review' && this.props.item.flux_type.type !== 'media'
                        && this.props.item.flux_type.type !== 'event' && this.props.item.flux_type.type !== 'status' ?
                        <SocialBar
                        navigation={this.props.navigation}
                        item={this.props.item.social}
                        user={this.props.item.user_id}
                        item_id={this.props.item.id}
                        full_item={this.props.item}
                        typeOfPost={this.props.item.flux_type.type}
                        />
                        :
                        null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        width: 355,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5
    }
})