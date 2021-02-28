import React from 'react'
import { AirbnbRating } from 'react-native-ratings'
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { appColor, almostWhite, barColor, restaurantColor, publicEventColor} from '../../Styles/styles';
import PostButton from './PostButton'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import earnedReward from '../Functions/functions';

class ReviewPlace extends React.Component {

    state = {
        review: "",
        rating: 3
    }

    _onChangeText = (text) => {
        this.setState({
            ...this.state,
            review: text
        })
    }

    _getStyle = () => {


        // switch(this.props.place.flames) {
        //     case 1:
        //         return {width: 31, height: 31}
        //         break;
        //     case 2:
        //         return {width: 31, height: 31}
        //         break;
        //     case 3:
        //         return {width: 31, height: 31}
        //         break;
        //     case 4:
        //         return {width: 31, height: 31}
        //         break;
        //     case 5:
        //         return {width: 31, height: 31}
        //         break;
        //     default:
        //         return {}
        //         break;
        // }

        return { width: 31, height: 31, margin: 10 }

    }

    _getImage = () => {

        if (this.props.place.amenity === "bar") {
            return require('../../Images/MapIcons/Bar/bar.png')
        } else if (this.props.place.amenity === "restaurant") {
            return require('../../Images/MapIcons/Restaurant/restaurant.png')
        } else {
            return require('../../Images/MapIcons/Event/event.png')
        }

    }

    _getTextColor = () => {
        if (this.props.place.amenity === "bar") {
            return {color: barColor}
        } else if (this.props.place.amenity === "restaurant") {
            return {color: restaurantColor}
        } else {
            return {color: publicEventColor}
        }
    }

    onPress = () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.username + '/reviews/place/' + this.props.place.id
        let myInit = {
            body: {
                desc: this.state.review,
                rating: this.state.rating,
                pending: this.props.user.reviews.pending,
                post: this.props.user.reviews.post
            }
        }

        API.post(apiName, path, myInit)
        .then(async () => {

            let reward = earnedReward({...this.props.user, reviews: {...this.props.user.reviews, post: [...this.props.user.reviews.post, {}]}}, "review")

            var user = {
                ...this.props.user,
                reviews: {
                    ...this.props.user.reviews,
                    pending: this.props.user.reviews.pending.filter((item, index) => index !== 0 )
                }
            }

            if (reward.cp > 0) {
                let apiName = 'Openclique'
                let path = '/achievements'
                let myInit = {
                    body: {
                        reward: reward,
                        achievement: {
                            type: "review",
                            amount: this.props.user.reviews.post.length + 1
                        },
                        user_id: this.props.user.username
                    }
                }
                user = await API.post(apiName, path, myInit)
                reward = earnedReward(user, "achievement")
                if (reward.cp > 0) {
                    let apiName = 'Openclique'
                    let path = '/achievements'
                    let myInit = {
                        body: {
                            reward: reward,
                            achievement: {
                                type: "achievement",
                                amount: user.achievements.length
                            },
                            user_id: user.username
                        }
                    }
                    user = await API.post(apiName, path, myInit)
                }
            }

            console.log("[REVIEW PLACE] Newly created user: ", user)

            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: user
                }
            }
            this.props.dispatch(action)
            this.props.refresh()
            this.setState({
                ...this.state,
                review: ''
            })

        })
        .catch(error =>{
            console.log(error.response)
        })


    }

    render() {
        
        return (

            <View style={{width: '100%', backgroundColor: 'white', alignItems: 'center', position: 'relative'}}>
                <TouchableOpacity
                onPress={this.props.onCancel}
                style={{position: 'absolute', top: 7, right: 7}}
                >
                    <Image source={require('../../Images/croix.png')} style={{width: 20, height: 20}}/>
                </TouchableOpacity>
                <Image  style={this._getStyle()} source={this._getImage()}/>
                <Text style={[{ fontWeight: 'bold' }, this._getTextColor()]}>{this.props.place.name}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
                    <TouchableOpacity style={{width: 20, height: 20, alignItems: 'center', justifyContent: 'center', margin: 7}} onPress={() => this.setState({...this.state, rating: this.state.rating - 1})}>
                        <Image style={{width: 20, height: 2.8}} source={require('../../Images/minus.png')}/>
                    </TouchableOpacity>
                    <AirbnbRating
                    count={5}
                    defaultRating={this.state.rating}
                    size={30}
                    showRating={false}
                    onFinishRating={rating => this.setState({...this.state, rating: rating})}
                    />
                    <TouchableOpacity style={{margin: 7}} onPress={() => this.setState({...this.state, rating: this.state.rating + 1})}>
                        <Image style={{width: 20, height: 20}} source={require('../../Images/plus.png')}/>
                    </TouchableOpacity>
                </View>
                <Text style={{fontWeight: '500', margin: 5}}>+100 CP</Text>
                <TextInput
                multiline
                numberOfLines={4}
                onChangeText={text => this._onChangeText(text)}
                value={this.state.review}
                style={{width: '90%', backgroundColor: almostWhite, borderWidth: 0.5, borderColor: "#8F8E94", minHeight: 100, borderRadius: 5, padding: 5}}
                placeholder="Add a description... +50 CP"
                />
                <PostButton
                backgroundColor={appColor}
                width={120}
                height={40}
                text="Post"
                borderRadius={5}
                onPress={this.onPress}
                />
            </View>

        )

    }
}

export default connect()(ReviewPlace)