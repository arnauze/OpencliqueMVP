import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import DatePicker from 'react-native-datepicker'
import {fromGeolocationToAddress} from '../../../API/Geocoding'
import TimePicker from "react-native-24h-timepicker";

export default class CreateEventDescriptionBar extends React.Component {

    state = {
        pickedStart: false,
        pickedEnd: false
    }

    findLocation() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.marker_coordinate) {
            let coord = this.props.navigation.state.params.marker_coordinate
            fromGeolocationToAddress(coord.latitude, coord.longitude).then(response => {
                this.props.changeAddress(response, coord)
            })
        }
        return(this.props.address ? this.props.address : 'Click to pick a location')
    }

    onCancel = () => {
        this.TimePicker.close()
    }

    onConfirm = (hours, minutes) => {
        if (this.state.type === 'start') {
            this.setState({
                ...this.state,
                pickedStart: true,
                start: {
                    hours: hours,
                    minutes: minutes
                }
            })
            this.props.changeHours(hours, minutes, 'start')
        } else {
            this.setState({
                ...this.state,
                pickedEnd: true,
                end: {
                    hours: hours,
                    minutes: minutes
                }
            })
            this.props.changeHours(hours, minutes, 'end')
        }
        this.TimePicker.close()
    }

    openTimePicker = (type) => {
        this.setState({
            ...this.state,
            type: type
        })
        this.TimePicker.open()
    }

    render() {
        return (
            <View style={styles.description_container}>
                <View style={{borderBottomWidth: 0.5, flex: 1, marginLeft: 15, marginRIght: 15}}>
                    <DatePicker
                    style={{position: 'relative', alignSelf: 'flex-start', width: '100%'}}
                    mode="date"
                    date={this.props.date}
                    placeholder="Select date"
                    format="MM/DD/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                        dateInput: {
                          borderWidth: 0
                        }
                    }}
                    onDateChange={(date) => {this.props.changeDate(date)}}
                    />
                </View>
                <TouchableOpacity
                onPress={() => this.openTimePicker('start')}
                style={styles.description_slice}
                >
                    {
                        this.state.pickedStart ? 
                        <Text>{this.state.start.hours}:{this.state.start.minutes}</Text>
                        :
                        <Text style={{color: 'lightgray'}}>Select starting time</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => this.openTimePicker('end')}
                style={styles.description_slice}
                >
                    {
                        this.state.pickedEnd ? 
                        <Text>{this.state.end.hours}:{this.state.end.minutes}</Text>
                        :
                        <Text style={{color: 'lightgray'}}>Select ending time</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.description_slice}
                onPress={() => this.props.navigation.navigate('PickLocation')}
                >
                    <Text style={{color: this.props.foundAddress ? 'black' : 'lightgray', textAlign: 'center'}}>{this.findLocation()}</Text> 
                </TouchableOpacity>
                <View style={[styles.description_slice_no_border, {height: this.props.descriptionHeight}]}>
                    <TextInput
                    placeholder='Description'
                    multiline={true}
                    onContentSizeChange={event => this.props.changeDescriptionSize(event)}
                    onChangeText={(text) => this.props.changeDescriptionText(text)}
                    />
                </View>
                <TimePicker
                ref={ref => {
                    this.TimePicker = ref;
                }}
                onCancel={() => this.onCancel()}
                onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    description_container: {
        backgroundColor: 'white',
        marginTop: 30,
        flex: 1,
        borderWidth: 0.5,
        justifyContent: 'center'
    },
    description_slice: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.5
    },
    description_slice_no_border: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15
    }
})