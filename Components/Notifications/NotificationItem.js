import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class NotificationItem extends React.Component {

    renderElement = () => {
        if (this.props.item.type === 'points') {
            // Item when the user earned points
            return <Text style={styles.user_text}>Your earned {this.props.item.data.amount} CP !</Text>
        } else if (this.props.item.type === 'achievement') {
            // Item unlocked a new achievement
            if (this.props.item.data.type === 'event') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Create {this.props.item.data.amount} events</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'item') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Earn {this.props.item.data.amount} items</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'status') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Post {this.props.item.data.amount} status</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'review') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Leave {this.props.item.data.amount} reviews</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'follow1') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Follow {this.props.item.data.amount} users</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'achievement') {
                return(
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Finish {this.props.item.data.amount} achievements</Text>
                    </React.Fragment>
                )
            } else if (this.props.item.data.type === 'poi') {
                return (
                    <React.Fragment>
                        <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                        <Text style={styles.user_text}>Discover {this.props.item.data.amount} unknown points</Text>
                    </React.Fragment>
                )
            }
        } else if (this.props.item.type === 'comment') {
            return <Text style={styles.user_text}>{this.props.item.data.from} commented your status !</Text>
        } else if (this.props.item.type === 'item') {
            return (
                <React.Fragment>
                    <Text style={styles.user_text}>You dropped a new item!</Text>
                    <Text style={styles.user_text}>Visit the boutique to unlock it</Text>
                </React.Fragment>
            )
        } else {
            // Only needed for now because of error I made before (can be cleaned when maxence's notifications are clean)
            return(
                <React.Fragment>
                    <Text style={styles.user_text}>You unlocked a new achievement !</Text>
                    <Text style={styles.user_text}>{this.props.item.amount} {this.props.item.type}</Text>
                </React.Fragment>
            )
        }
    }

    render() {
        // console.log("[NOTIFICATION ITEM] Item: ", this.props.item)
        return (
            <View style={styles.main_container}>
                {
                    this.renderElement()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        minHeight: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
        width: '95%',
        alignSelf: 'center'
    },
    user_text: {
        fontWeight: 'bold',
        marginLeft: 10
    }
})