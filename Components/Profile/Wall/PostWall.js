import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import StatusSummary from '../../Shared/StatusSummary'
import { appColor } from '../../../Styles/styles'
import { timeDifference } from '../../Functions/functions'
import SocialHeader from '../../Shared/SocialHeader'
import SocialBar from '../../Shared/SocialBar'

export default class PostWall extends React.Component {

    getDivision = (item, index) => {

        if (item.type === 'joined') {

            return (
                <View key={index} style={{width: '100%', alignItems: 'center'}}>
                    <View style={{backgroundColor: appColor, height: 50, width: '60%', borderRadius: 5, alignItems: 'center', justifyContent: 'center', margin: 10, marginBottom: 5}}>
                        <Text style={{fontWeight: '600', color: 'white'}}>Joined Openclique</Text>
                    </View>
                    <Text style={{marginBottom: 10}}>{timeDifference(Date.now(), item.data.timestamp).number} {timeDifference(Date.now(), item.data.timestamp).timeframe} ago</Text>
                </View>
            )

        } else if (item.type === 'status') {

            return (
                <View key={index} style={{width: '100%', borderBottomWidth: 1, borderBottomColor: 'gray'}}>
                    <SocialHeader
                    user={this.props.user}
                    navigation={this.props.navigation}
                    timeDifference={timeDifference(Date.now(), item.data.timestamp)}
                    inFlux={false}
                    item={item}
                    />
                    <StatusSummary
                    editable={false}
                    status={item}
                    title={item.data.title}
                    description={item.data.description}
                    />
                    <SocialBar
                    navigation={this.props.navigation}
                    item={item.data.social}
                    user={this.props.user.username}
                    item_id={item.data.id}
                    full_item={item.data}
                    typeOfPost={"status"}
                    user={this.props.user}
                    />
                </View>

            )

        }

    }

    render() {
        console.log("[POST WALL] this.props: ", this.props)
        return (
            <View style={{alignItems: 'center', width: '100%'}}>
                {
                    this.props.items.map((item, index) => this.getDivision(item, index))
                }
            </View>
        )
    }

}