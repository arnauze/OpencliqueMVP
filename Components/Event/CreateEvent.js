import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from 'react-native'
import CreateEventTopBar from './Helpers/CreateEventTopBar'
import CreateEventDescriptionBar from './Helpers/CreateEventDescriptionBar'
import CreateEventCohostBar from './Helpers/CreateEventCohostBar'
import { API, Storage } from 'aws-amplify'
import { connect } from 'react-redux'
import { appColor } from '../../Styles/styles'
import earnedReward, { toTimestamp, readFile } from '../Functions/functions';

class CreateEvent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            descriptionHeight: 60,
            changed: false,
            descriptionText: '',
            address: '',
            foundAddress: false,
            eventName: '',
            date: undefined,
            hours: 0,
            minutes: 0,
            privacy: 'Private',
            coHosts: [],
            coHostInput: '',
            chosenReward: 'Item',
            marker: {},
            switchValue: false,
            disabled: false,
            image: {}
        }
        this._changeDescriptionSize = this._changeDescriptionSize.bind(this)
        this._changeDescriptionText = this._changeDescriptionText.bind(this)
        this._changeDate = this._changeDate.bind(this)
        this._changeAddress = this._changeAddress.bind(this)
        this._changeEventName = this._changeEventName.bind(this)
        this._changePrivacy = this._changePrivacy.bind(this)
        this._addCohost = this._addCohost.bind(this)
        this._changeCohostText = this._changeCohostText.bind(this)
        this._removeCohost = this._removeCohost.bind(this)
    }

    // Function that changes the size of the description View component to fit the entire description

    _changeDescriptionSize(event) {
        if (this.state.descriptionHeight < event.nativeEvent.contentSize.height) {
            this.setState({
                ...this.state,
                descriptionHeight: event.nativeEvent.contentSize.height + 10,
                changed: true
            })
        } else if (this.state.descriptionHeight > event.nativeEvent.contentSize.height && this.state.changed && this.state.descriptionHeight > 67) {
            this.setState({
                ...this.state,
                descriptionHeight: event.nativeEvent.contentSize.height + 10,
                changed: true
            })
        }
    }

    _changeDescriptionText(text) {
        this.setState({
            ...this.state,
            descriptionText: text
        })
    }

    _changeDate(date) {
        this.setState({
            ...this.state,
            date: date
        })
    }

    _changeAddress(response, coord) {
        console.log(response)
        if (response.results[0].formatted_address !== this.state.address) {
            this.setState({
                ...this.state,
                address: response.results[0].formatted_address,
                foundAddress: true,
                marker: coord
            })
        }
    }

    _changeEventName(text) {
        this.setState({
            ...this.state,
            eventName: text
        })
    }

    _changePrivacy(text) {
        this.setState({
            ...this.state,
            privacy: text
        })
    }

    _addCohost(name) {
        this.setState({
            ...this.state,
            coHostInput: '',
            coHosts: [...this.state.coHosts, name]
        })
    }

    _removeCohost(name) {
        this.setState({
            ...this.state,
            coHosts: this.state.coHosts.filter(item => item !== name)
        })
    }

    _changeCohostText(text) {
        this.setState({
            ...this.state,
            coHostInput: text
        })
    }

    _changeHoursAndMinutes = (hours, minutes, type) => {
        if (type === 'start') {
            this.setState({
                ...this.state,
                start: {
                    hours: hours,
                    minutes: minutes
                }
            })
        } else {

            this.setState({
                ...this.state,
                end: {
                    hours: hours,
                    minutes: minutes
                }
            })

        }
    }

    _createEventAndNavigate = async () => {

        // date.getTimezoneOffset() returns the difference between our time zone and UTC, in minutes

        var newDate = this.state.date.split('/')
        var date = new Date()
        var start_hour = toTimestamp(newDate[2], newDate[0], newDate[1], this.state.start.hours, this.state.start.minutes, 0)
        var end_hour = toTimestamp(newDate[2], newDate[0], newDate[1], this.state.end.hours, this.state.end.minutes, 0)

        start_hour += date.getTimezoneOffset() * 60
        end_hour += date.getTimezoneOffset() * 60

        if (end_hour < start_hour) {

            console.log("Got in")
            console.log("End hour before:", end_hour)

            var extra = 24 - this.state.start.hours
            var total = extra + this.state.end.hours
            end_hour += total * 60 * 60

            console.log("End hour after:", end_hour)

        }

        console.log("Start hour:", start_hour)
        console.log("End hour:", end_hour)
        console.log("Current hour:", Date.now()/1000)

        if (start_hour < Date.now()/1000) {

            // If the user is trying to create an event that will start before the current date, then I output an error message

            this.setState({
                ...this.state,
                errorMessage: "The date of your event can't be before the current date!"
            }, () => setInterval(() => this.setState({...this.state, errorMessage: ''}), 10000))

        } else if (end_hour < start_hour) {

            this.setState({
                ...this.state,
                errorMessage: "Your event can't finish before it starts!"
            }, () => setInterval(() => this.setState({...this.state, errorMessage: ''}), 10000))

        } else {
            // Adding the image in database
            var medias = []
            if (this.state.image.uri) {
                var randomId = (Date.now() + Math.random()).toString()
                var key = this.props.user.info.username + '/' + randomId

                await readFile(this.state.image.origURL).then(async buffer => {
                    await Storage.put(key, buffer, {
                        contentType: this.state.image.type
                    }).then(response => {
                        return response
                    }).catch(e => {
                        console.log('error', e)
                    })
                }).catch(e => {
                    console.log(e);
                });

                medias = [key]
            } 

            var event_id = (Date.now() + Math.random()).toString()
            var event = {
                "id": event_id,
                "timestamp": Date.now(),
                "privacy": this.state.privacy,
                "guests_invites" : this.state.privacy === 'Private' ? this.state.switchValue : true,
                "medias": medias,
                "date": {
                    "timestamp": start_hour,
                    "start_hour": this.state.start,
                    "end_hour": this.state.end,
                    "day": this.state.date
                },
                "geometry": {
                    "lat": this.state.marker.latitude,
                    "lng": this.state.marker.longitude
                },
                "address": this.state.address,
                "admins": this.state.coHosts,
                "creator": this.props.user.info.username,
                "description": this.state.descriptionText,
                "name": this.state.eventName,
                "guests": {
                    "invited": this.state.coHosts,
                    "interested": [],
                    "coming": [this.props.user.info.username]
                },
                "archive": end_hour,
                "social": {
                    "likes": [],
                    "comments": []
                }
            }

            apiName = 'Openclique';
            path = '/events'; 
            myInit = {
                body: event
            }

            API.post(apiName, path, myInit).then(async () => {

                console.log("New event created!")

                // We are using the old user not the updated one

                let reward = earnedReward({...this.props.user.info, events: [...this.props.user.info.events, event_id]}, "event")
                var user = this.props.user.info
                if (reward.cp > 0) {
                    let apiName = 'Openclique'
                    let path = '/achievements'
                    let myInit = {
                        body: {
                            reward: reward,
                            achievement: {
                                type: "event",
                                amount: this.props.user.info.events.length + 1
                            },
                            user_id: this.props.user.info.username
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

                let action = {
                    type: 'UPDATE_USER',
                    value: {
                        full: true,
                        user: user
                    }
                }
                this.props.dispatch(action)

                this.props.navigation.navigate('Map', { newEventCreated: true })
            })
        }
    }

    _canCreateEvent = () => {
        if (this.state.date && this.state.marker && this.state.address && this.state.descriptionText && this.state.eventName)
            return true
        return false
    }

    onSwitchValueChange = () => {
        this.setState({
            ...this.state,
            switchValue: this.state.switchValue ? false : true
        })
    }

    _displayErrorMessage = () => {

        if (this.state.errorMessage) {
            return (
                <Text style={{color: 'red', fontWeight: '500', margin: 7}}>{this.state.errorMessage}</Text>
            )
        }

    }

    render() {
        console.log(this.state)
        var date = new Date()
        console.log("OFFSET:", date.getTimezoneOffset()/60)
        return (
            <ScrollView style={{backgroundColor: 'lightgray'}}>
                <CreateEventTopBar
                changeEventName={this._changeEventName}
                changePrivacy={this._changePrivacy}
                privacy={this.state.privacy}
                disabled={this.state.disabled}
                setImage={(image) => this.setState({ image: image, disabled: true })}
                />
                {
                    this.state.image.uri ? 
                        <View style={{width: '100%', height: 200, marginTop: 10, position: 'relative'}}>
                            <Image source={{uri: this.state.image.uri}} style={{flex: 1}}/>
                            <TouchableOpacity style={{position: 'absolute', top: 5, right: 5}} onPress={() => this.setState({image: {}, disabled: false})} ><Text>Cancel</Text></TouchableOpacity>
                        </View>
                    :
                        null
                }
                <CreateEventDescriptionBar
                changeDescriptionSize={this._changeDescriptionSize}
                changeDescriptionText={this._changeDescriptionText}
                changeDate={this._changeDate}
                changeAddress={this._changeAddress}
                changeMarkerLocation={this._changeMarkerLocation}
                changeHours={this._changeHoursAndMinutes}
                descriptionHeight={this.state.descriptionHeight}
                date={this.state.date}
                hours={this.state.hours}
                minutes={this.state.minutes}
                address={this.state.address}
                foundAddress={this.state.foundAddress}
                navigation={this.props.navigation}
                />
                <CreateEventCohostBar 
                privacy={this.state.privacy}
                text={this.state.coHostInput}
                coHosts={this.state.coHosts}
                addCohost={this._addCohost}
                changeCohostText={this._changeCohostText}
                removeCohost={this._removeCohost}
                switchValue={this.state.switchValue}
                onSwitchValueChange={this.onSwitchValueChange}
                />
                <TouchableOpacity
                style={[styles.confirm_button, { backgroundColor: this._canCreateEvent() ? appColor : 'gray'}]}
                disabled={!this._canCreateEvent()}
                onPress={() => {
                    this._createEventAndNavigate()
                }}
                >
                    <Text style={{fontWeight: 'bold', color: 'white'}}>Create</Text>
                </TouchableOpacity>
                {this._displayErrorMessage()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    confirm_button: {
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(CreateEvent)