import React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import { appColor, barColor, restaurantColor, publicEventColor, almostWhite } from '../../Styles/styles'
import PostButton from './PostButton';
import { timeDifference } from '../Functions/functions';

class AddSticker extends React.Component {

    render() {

        return (

            <TouchableOpacity
            style={{width: 50, height: 50, borderWidth: 2, borderRadius: 25, borderColor: appColor, alignItems: 'center', justifyContent: 'center'}}
            onPress={this.props.addSticker}
            >
                <Image style={{width: 30, height: 30}} source={require('../../Images/plus.png')}/>
            </TouchableOpacity>

        )

    }

}

export default class StatusSummary extends React.Component {

    _getStyle = () => {
        return { width: 31, height: 31 }
    }

    _getImage = () => {

        if (this.props.status.data.place.type === "bar") {
            return require('../../Images/MapIcons/Bar/bar.png')
        } else if (this.props.status.data.place.type === "restaurant") {
            return require('../../Images/MapIcons/Restaurant/restaurant.png')
        } else {
            return require('../../Images/MapIcons/Event/event.png')
        }

    }

    _getTextColor = () => {
        if (this.props.status.data.place.type === "bar") {
            return {color: barColor}
        } else if (this.props.status.data.place.type === "restaurant") {
            return {color: restaurantColor}
        } else {
            return {color: publicEventColor}
        }
    }

    addSticker = () => {
        console.log("Add sticker !")
    }

    render() {

        // console.log("[STATUS SUMMARY] We got in here")

        return (

            <View style={{flex: 1}}>
                <View style={{margin: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 5}}>
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                            <Image source={this._getImage()} style={[this._getStyle()]}/>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            {
                                this.props.editable
                                ?
                                    <TextInput
                                    style={{ fontSize: 18 }}
                                    placeholder='Enter a title...'
                                    value={this.props.title}
                                    onChangeText={this.props.onChangeTitle}
                                    />
                                :
                                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{this.props.title}</Text>
                            }
                        </View>
                        <View style={{flex: 1, alignSelf: 'flex-start', alignItems: 'flex-end'}}>
                            {
                                this.props.editable ?
                                    <TouchableOpacity
                                    onPress={this.props.onCancel}
                                    >
                                        <Image source={require('../../Images/croix.png')} style={{width: 20, height: 20}}/>
                                    </TouchableOpacity>
                                :
                                    null
                            }
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 5}}>
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                            <Text style={[this._getTextColor(), { fontWeight: '600', textAlign: 'center' }]}>{this.props.status.data.place.name}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            {
                                this.props.status.data.with.length > 0
                                ?
                                    <Text style={{alignSelf: 'center'}}>with {this.props.status.data.with.map((item, index) => ( <Text key={index}>{item.username} </Text> ))}</Text>
                                :
                                    null
                            }
                        </View>
                        <View style={{flex: 1}}></View>
                    </View>

                    <View style={{flexDirection: 'row', marginBottom: 10, marginLeft: 5}}>
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                            <Text>{this.props.status.data.cp_earned} CP</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Text>{timeDifference(Date.now(), this.props.status.data.timestamp).number} {timeDifference(Date.now(), this.props.status.data.timestamp).timeframe} ago</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}></View>
                    </View>

                    <View style={{alignItems: 'center'}}>
                        {
                            this.props.editable ?
                                <React.Fragment>
                                    <TextInput
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={this.props.onChangeDescription}
                                    value={this.props.description}
                                    style={{width: '100%', backgroundColor: almostWhite, borderWidth: 0.5, borderColor: "#8F8E94", minHeight: 70, borderRadius: 5, padding: 5, marginBottom: 5}}
                                    placeholder="Add a description..."
                                    />
                                    <View style={{ flexDirection: 'row', margin: 10}}>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <AddSticker addSticker={this.addSticker}/>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <AddSticker addSticker={this.addSticker}/>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <AddSticker addSticker={this.addSticker}/>
                                        </View>
                                    </View>
                                </React.Fragment>
                            :
                                <Text>{this.props.description}</Text>
                        }
                    </View>
                    {
                        this.props.editable ?
                            <PostButton
                            backgroundColor={appColor}
                            onPress={this.props.onPost}
                            width={100}
                            height={40}
                            text="Post"
                            borderRadius={5}
                            />
                        :
                            null
                    }
                </View>
            </View>

        )
    }
}