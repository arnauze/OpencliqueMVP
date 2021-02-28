import React from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker'
import { Rating } from 'react-native-ratings'
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory'
import CreateFluxContent from './CreateFluxContent'
import { connect } from 'react-redux'
import { isEmpty } from '../Functions/functions'

class ShareContent extends React.Component {

    static navigationOptions = ({navigation}) => ({
        headerRight: <CreateFluxContent navigation={navigation}/>
    })

    state = {
        text: '',
        reviewUpdated: false,
        locationUpdated: false,
        review: {},
        location: {},
        media: {},
        user: this.props.user
    }

    _pickImage() {
    
        ImagePicker.showImagePicker({}, response => {

            // Here I need to log the response but without the data field because it is too long.

            if (!response.didCancel) {
                var body = {
                    uri: response.uri,
                    url: response.origURL,
                    name: response.fileName,
                    height: response.height,
                    width: response.width,
                    type: response.type
                }

                console.log(body)

                this.setState({
                    ...this.state,
                    media: body
                }, () => this.props.navigation.setParams({ state: this.state }))
            }
        })
    }

    _displayLocation() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.location && !this.props.navigation.state.params.review) {

            if (!this.state.locationUpdated) {
                this.setState({
                    ...this.state,
                    locationUpdated: true,
                    location: this.props.navigation.state.params.location
                }, () => this.props.navigation.setParams({ state: this.state }))
            }

            return (
                <View
                style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <Image 
                    source={require('../../Images/location_flux.png')}
                    style={{height: 25, width: 25, margin: 20}}
                    />
                    <View>
                        <Text style={{fontWeight: 'bold'}}>{this.props.navigation.state.params.location.name}</Text>
                        <Text style={{fontWeight: '100'}}>{this.props.navigation.state.params.location.address}</Text>
                    </View>
                </View>
            )
        } else if (this.props.navigation.state.params && this.props.navigation.state.params.review) {

            if (!this.state.locationUpdated) {
                this.setState({
                    ...this.state,
                    locationUpdated: true,
                    location: this.props.navigation.state.params.reviewLocation
                }, () => this.props.navigation.setParams({ state: this.state }))
            }

            return (
                <View
                style={{flexDirection: 'row', alignItems: 'center'}}
                >
                    <Image 
                    source={require('../../Images/location_flux.png')}
                    style={{height: 25, width: 25, margin: 20}}
                    />
                    <View>
                        <Text style={{fontWeight: 'bold'}}>{this.props.navigation.state.params.reviewLocation.name}</Text>
                        <Text style={{fontWeight: '100'}}>{this.props.navigation.state.params.reviewLocation.address}</Text>
                    </View>
                </View>
            )
        }
    }

    _displayMedia() {

        if (!isEmpty(this.state.media)) {
            return (
                <Image
                source={{uri: this.state.media.uri}}
                style={{width: 325, height: 425, borderRadius: 10, alignSelf: 'center', marginTop: 10}}
                />
            )
        }
    }

    _displayReview() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.review) {
            let newReview = this.props.navigation.state.params.review
            let location = this.props.navigation.state.params.reviewLocation
            let type = this.props.navigation.state.params.reviewType

            if (!this.state.reviewUpdated) {
                this.setState({
                    ...this.state,
                    reviewUpdated: true,
                    review: {
                        ratings: newReview,
                        location: location,
                        type: type
                    }
                }, () => this.props.navigation.setParams({ state: this.state }))
            }

            return (
                <View style={styles.review_main_container}
                >
                    <View style={{alignItems: 'center', borderBottomWidth: 0.5}}>
                        <Text style={[styles.review_header_text, { fontWeight: 'bold' }]}>{location.name}</Text>
                        <Text style={styles.review_header_text}>{type}</Text>
                        <Text style={[styles.review_header_text, { fontWeight: 'bold' }]}>General: </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Text style={[styles.review_header_text, { marginRight: 5}]}>{newReview.general.rating}</Text>
                            <Rating 
                            count={5}
                            startingValue={newReview.general.rating}
                            imageSize={15}
                            ratingBackgroundColor='lightgray'
                            readonly
                            />
                        </View>
                    </View>
                    <View style={styles.review_ratings_main_container}>
                        <View style={styles.review_column}>
                            {
                                newReview.fields.map((item, index) => (
                                    index % 2 == 0 ? 
                                    <View key={index} style={{margin: 10, alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>{item.field}:</Text>
                                        <Text>{item.rating}/5</Text>
                                        <Rating 
                                        count={5}
                                        startingValue={item.rating}
                                        imageSize={15}
                                        ratingBackgroundColor='lightgray'
                                        readonly
                                        />
                                    </View>
                                    : null
                                ))
                            }
                        </View>
                        <View style={styles.review_column}>
                            {
                                newReview.fields.map((item, index) => (
                                    index % 2 == 1 ?
                                    <View key={index} style={{margin: 10, alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold'}}>{item.field}:</Text>
                                        <Text>{item.rating}/5</Text>
                                        <Rating 
                                        count={5}
                                        startingValue={item.rating}
                                        imageSize={15}
                                        ratingBackgroundColor='lightgray'
                                        readonly
                                        />
                                    </View>
                                    : null
                                ))
                            }
                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <KeyboardAwareScrollView style={{marginBottom: 40}}>
                    <TextInput
                    style={styles.text_input}
                    multiline
                    onChangeText={text => this.setState({
                        text: text
                    }, () => this.props.navigation.setParams({ state: this.state }))}
                    // ref={(input) => { this.showKeyboard = input; }} 
                    placeholder="What's new ?"
                    />
                    {this._displayReview()}
                    {this._displayMedia()}
                    {this._displayLocation()}
                </KeyboardAwareScrollView>
                <KeyboardAccessory
                verticalOffset={-49}
                >
                    <ScrollView style={{height: 40}}
                    contentContainerStyle={styles.social_bar}
                    horizontal
                    scrollEnabled={false}
                    keyboardShouldPersistTaps='always'
                    >
                        <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('LeaveReview')}
                        >
                            <Image
                            style={[styles.social_icon, { marginLeft: 10 }]}
                            source={require('../../Images/review.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => this._pickImage()}
                        >
                            <Image
                            style={styles.social_icon}
                            source={require('../../Images/add_media.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ShareLocation')}
                        >
                            <Image
                            style={styles.social_icon}
                            source={require('../../Images/location_flux.png')}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAccessory>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        backgroundColor: 'lightgray'
    },
    text_input: {
        fontWeight: '500',
        fontSize: 16,
        margin: 5,
        maxHeight: 200,
        minHeight: 40,
        justifyContent: 'center'
    },
    bottom_bar: {
        backgroundColor: 'white'
    },
    social_icon: {
        height: 24,
        width: 24,
        marginRight: 20
    },
    social_bar: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    review_ratings_main_container: {
        flexDirection: 'row'
    },
    review_column: {
        flex: 1,
        alignItems: 'center'
    },
    review_main_container: {
        backgroundColor: 'white',
        borderWidth: 0.5
    },
    review_header_text: {
        marginTop: 5
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ShareContent)