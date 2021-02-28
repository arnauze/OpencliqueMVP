import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import {shouldEarned} from '../../Functions/functions'
import { appColor } from '../../../Styles/styles';

class AchievementItem extends React.Component {

    state = {
        reward: {}
    }

    nextValue = (value) => {
        if (value < 5) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(5)})
            return 5
        } else if (value >= 5 && value < 10) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(10)})
            return 10
        } else if (value >= 10 && value < 25) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(25)})
            return 25
        } else if (value >= 25 && value < 50) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(50)})
            return 50
        } else if (value >= 50 && value < 100) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(100)})
            return 100
        } else if (value >= 100 && value < 250) {
            if (!this.state.reward.cp)
                this.setState({reward: shouldEarned(250)})
            return 250
        }
    }

    getValues = () => {
        switch(this.props.item.type) {
            case "event":
                return this.props.user.info.events.length + ' / ' + this.nextValue(this.props.user.info.events.length)
            case "item":
                return this.props.user.info.items.earned + ' / ' + this.nextValue(this.props.user.info.items.earned)
            case "review":
                return this.props.user.info.reviews.post.length + ' / ' + this.nextValue(this.props.user.info.reviews.post.length)
            case "follow1":
                return this.props.user.info.friends.length + ' / ' + this.nextValue(this.props.user.info.friends.length)
            case "status":
                return this.props.user.info.status_total + ' / ' + this.nextValue(this.props.user.info.status_total)
            case "poi":
                return this.props.user.info.places_visited.length + ' / ' + this.nextValue(this.props.user.info.places_visited.length)
            case "achievement":
                return this.props.user.info.achievements.length + ' / ' + this.nextValue(this.props.user.info.achievements.length)
        }
    }

    getIcon = () => {
        switch(this.props.item.type) {
            case "event":
                return require('../../../Images/MapIcons/Event/event.png')
            case "item":
                return require('../../../Images/Achievements/get_item.png')
            case "review":
                return require('../../../Images/Achievements/leave_review.png')
            case "follow1":
                return require('../../../Images/Achievements/leave_review.png')
            case "status":
                return require('../../../Images/Achievements/leave_review.png')
            case "poi":
                return require('../../../Images/MapIcons/unknown_point.png')
            case "achievement":
                return require('../../../Images/Achievements/leave_review.png')
        }
    }

    render() {
        return (
            <View style={{minHeight: 60, borderBottomWidth: 0.5, borderBottomColor: 'lightgray', justifyContent: 'center'}}>
                <View style={{margin: 5, alignItems: 'center', flexDirection: 'row'}}>
                    <View style={{flex: 2, alignItems: 'center'}}>
                        <Image
                        source={this.getIcon()}
                        style={{width: 20, height: 20}}
                        />
                    </View>
                    <View style={{flex: 6, alignItems: 'center'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text>{this.props.item.text}</Text>
                            <Text>{this.getValues()}</Text>
                        </View>
                    </View>
                    <View style={{flex: 3, alignItems: 'center'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text>{this.state.reward.cp} <Text style={{color: appColor}}>CP</Text></Text>
                            <Text>{this.state.reward.gold} <Text style={{color: appColor}}>Golds</Text></Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AchievementItem)