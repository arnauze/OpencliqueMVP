import React from 'react'
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity, Switch} from 'react-native'
import { connect } from 'react-redux'

class CreateEventCohostBar extends React.Component {

    state = {
        errorMessage: ''
    }

    _displayMessage() {
        if (this.props.privacy === 'Private') {
            return (
                <View style={{borderWidth: 0.5, borderBottomWidth: 0}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 40, margin: 5}}>
                        <Text style={{flex: 4}}>Guests can invite their friends</Text>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Switch
                            value={this.props.switchValue}
                            onChange={() => this.props.onSwitchValueChange()}
                            />
                        </View>
                    </View>
                </View>
            )
        }
    }

    _displayCohosts() {
        if (this.props.coHosts.length > 0) {
            return (
                this.props.coHosts.map((item, index) => (
                    <View 
                    key={index}
                    style={[styles.co_host, {flexDirection: 'row'}]}
                    >
                       <Text style={{fontSize: 16}}>{item}</Text> 
                       <TouchableOpacity
                       onPress={() => this.props.removeCohost(item)}
                       style={{position: 'absolute', right: 20}}
                       >
                           <Image 
                           style={{height: 10, width: 10}}
                           source={require('../../../Images/croix.png')}
                           />
                       </TouchableOpacity>
                    </View>
                ))
            )
        }
    }

    onSubmitEditing = (name) => {
        if (this.props.user.info.friends.indexOf(name) >= 0)
            this.props.addCohost(name)
        else
            this.setState({
                ...this.state,
                errorMessage: "We can't seem to find any friend of yours with this username, sorry"
            })
    }

    _displayErrorMessage = () => {
        if (this.state.errorMessage)
            return <Text style={{color: 'red', alignSelf: 'center', textAlign: 'center'}}>{this.state.errorMessage}</Text>
    }

    _onChangeText = text => {
        if (this.state.errorMessage)
            this.setState({
                ...this.state,
                errorMessage: ''
            })
        this.props.changeCohostText(text)
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this._displayMessage()}
                {this._displayErrorMessage()}
                <View style={styles.co_host}>
                    <TextInput
                    autoCapitalize="none"
                    style={styles.text_input}
                    placeholder='Add co-hosts'
                    value={this.props.text}
                    onChangeText={text => this._onChangeText(text)}
                    onSubmitEditing={event => this.onSubmitEditing(event.nativeEvent.text)}
                    />
                </View>
                {this._displayCohosts()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        marginTop: 30,
        backgroundColor: 'white'
    },
    co_host: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: 40,
        borderWidth: 0.5
    },
    text_input: {
        fontSize: 18,
        margin: 5
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(CreateEventCohostBar)