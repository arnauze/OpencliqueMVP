import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { formatDate, getMonth, getDay } from '../Functions/functions'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import BookingSummary from './BookingSummary';

class CalendarComponent extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerRight:
                <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => navigation.navigate('CreateEvent')}
                >
                    <Text style={{color: '#F05463', fontSize: 14}}>
                        Create event
                    </Text>
                </TouchableOpacity>,
        }
    }

    state = {
        loading: true,
        marked: {
            [formatDate(Date.now())]: {selected: true, selectedColor: '#F05463'}
        },
        selected: formatDate(Date.now())
    }

    componentWillMount = () => {

        this._getBookings()

    }

    _getBookings = () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/bookings'
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {

            // The API returns an array of event objects

            console.log("Return from call to bookings API", response)

            var bookings = response
            var marked = this.state.marked

            // Here I add the events I'm registered to to the state

            bookings.map(item => {

                marked[formatDate(item.date.day)] = {marked: true}

            })

            this.setState({

                ...this.state,
                bookings: response,
                marked: marked,
                selected: formatDate(Date.now()),
                loading: false

            })

        })
        .catch(error => {
            console.log(error.response)
        })

    }

    _onDayPress = day => {

        // Function that changes the selected date on the calendar

        console.log(day)
        // First I unselect the previously selected date
        var newMarked = {
            ...this.state.marked[this.state.selected], selected: false
        }

        // Then I add the new selected day, and change the state
        this.setState({

            ...this.state,
            marked: {
                ...this.state.marked,
                [this.state.selected]: newMarked,
                [day.dateString]: {
                    selected: true,
                    selectedColor: '#F05463',
                    marked: this.state.marked[day.dateString] && this.state.marked[day.dateString].marked ? true : false
                }
            },
            selected: day.dateString

        })

    }

    _getSelectedDate = () => {

        // Function that splits the selected date and format it in a readable way

        var splittedDate = this.state.selected.split('-')

        var month = getMonth(splittedDate[1])
        var day = getDay(splittedDate[2])

        return month + ' ' + day + ' ' + splittedDate[0]
    }

    _findEventToOutput = () => {
        
        // Function that looks for the informations of the booking(s) we need in the array of bookings based on the selected date in the calendar
        // This returns an array with one or more bookings

        return this.state.bookings.filter(item => {

            return formatDate(item.date.day) === this.state.selected

        })
        
    }

    _outputDateEvents = () => {

        // Function that checks if the user has something planned today and outputs accordingly

        if (this.state.marked[this.state.selected].marked) {

            // If the user has something planned on that day

            var events = this._findEventToOutput()
            
            console.log(events)

            if (events.length === 1) {

                return (

                    <BookingSummary
                    booking={events[0]}
                    navigation={this.props.navigation}
                    />

                )

            } else {

                return (
                    events.map((item, index) => {

                        return (

                            <BookingSummary
                            key={index}
                            booking={item}
                            navigation={this.props.navigation}
                            />

                        )
    
                    })
                )

            }


        } else {

            // If the user doesn't have anything planned

            return (
                <Text style={{color: '#8F8E94', alignSelf: 'center'}}>You have nothing planned</Text>
            )

        }

    }

    render() {

        console.log("Calendar component state:", this.state)
        console.log("Calendar component props:", this.props)

        if (this.state.loading) {

            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )

        } else {

            return (
                <ScrollView
                style={{flex: 1}}
                alwaysBounceVertical={false}
                >
                    <Calendar
                    onDayPress={day => this._onDayPress(day)}
                    markedDates={this.state.marked}
                    />
                    <View style={{ height: 0.5, width: '100%', backgroundColor: 'lightgray', marginTop: 10, marginBottom: 10 }}/>
                    <Text style={{alignSelf: 'center', fontSize: 15, fontWeight: '500', color: '#F05463', marginBottom: 10}}>{this._getSelectedDate()}</Text>
                    {this._outputDateEvents()}
                </ScrollView>
            )

        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(CalendarComponent)