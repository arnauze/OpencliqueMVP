import React from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { AirbnbRating, Rating } from 'react-native-ratings'

export default class ReviewForm extends React.Component {

    state = {
        general: {
            rating: null
        },
        fields: [],
        isDisabled: true
    }


    _calculateAverage(index) {

        // Function that calculates the average value of all the ratings, for the general rating

        var total_rating = 0
        var total_index = 0

        this.state.fields.map(item => {
            total_rating += item.rating
            total_index += 1
        })

        if (this.state.fields.length == this.props.total) {
            this.setState({
                ...this.state,
                general: {
                   rating: total_rating / total_index
                },
                isDisabled: false
            })
        } else {
            this.setState({
                ...this.state,
                general: {
                   rating: total_rating / total_index
                }
            })
        }

    }

    _chooseReview(rating, item) {

        // Function that adds the new rated field into the state
        // Needs fix because if I click on a field other than the first one to start, it still adds the review text above the first, instead of the one clicked on

        let reviews = ["Terrible", "Disapointing", "Fine", "Great", "Awesome"]
        let price_reviews = ["Very expensive", "Expensive", "Medium", "Affordable", "Very affordable"]
        let index = this._indexOf(item)
        if (this.state.fields[index]) {

            var changedField = this.state.fields

            changedField[index] = {
                ...changedField[index],
                rating: rating,
                text: item === 'Price' ? price_reviews[rating - 1] : reviews[rating - 1],
            }

            this.setState({
                ...this.state,
                fields: changedField
            }, () => this._calculateAverage(index))

        } else {
            this.setState({
                ...this.state,
                fields: [...this.state.fields, {
                    text: item === 'Price' ? price_reviews[rating - 1] : reviews[rating - 1],
                    rating: rating,
                    field: item
                }]
            }, () => this._calculateAverage(index))

        }
    }

    _indexOf(text) {
        if (this.state && this.state.fields) {
            console.log(this.state.fields.findIndex(item => item.field === text))
            return this.state.fields.findIndex(item => item.field === text)
        }
        return -1
    }

    render() {
        return (
            <ScrollView
            contentContainerStyle={styles.main_container_layout}
            >
            {this.props.fields.map((item, index) => {
                return (
                    <View key={index} style={styles.form_field}>
                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.rating_type_text}>{item}:</Text>
                        </View>
                        <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.review_text}>{this._indexOf(item) >= 0 ? this.state.fields[this._indexOf(item)].text : ''}</Text>
                            <AirbnbRating
                            count={5}
                            defaultRating={0}
                            size={20}
                            showRating={false}
                            onFinishRating={rating => this._chooseReview(rating, item)}
                            />
                        </View>
                    </View>
                )
            })}
            <View style={styles.form_field}>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.rating_type_text}>General:</Text>
                </View>
                <View style={{flex: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Rating
                    type='custom'
                    count={5}
                    fractions={1}
                    startingValue={this.state.general.rating ? this.state.general.rating : 0}
                    imageSize={20}
                    ratingBackgroundColor='lightgray'
                    onFinishRating={rating => {
                        this.setState({
                            ...this.state,
                            general: {
                                rating: rating
                            }
                        })
                    }}
                    />
                    <Text style={styles.review_note}>{this.state.general.rating ? this.state.general.rating.toFixed(1) : ''}</Text>
                </View>
            </View>
            <TouchableOpacity
            style={[styles.confirm_button, { backgroundColor: this.state.isDisabled ? 'rgba(255,165,0, 0.5)' : 'rgba(255,165,0,1)'}]}
            disabled={this.state.isDisabled}
            onPress={() => {
                this.props.navigation.navigate('ShareContent', { review: this.state, reviewLocation: this.props.location, reviewType: this.props.type })
            }}
            >
                <Text>Confirm review</Text>
            </TouchableOpacity>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main_container_layout: {
        justifyContent: 'space-around'
    },
    form_field: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
        height: 60
    },
    rating_type_text: {
        fontSize: 18,
        fontWeight: '600'
    },
    review_text: {
        fontSize: 18,
        fontWeight: '400',
        color: 'orange',
        margin: 5
    },
    review_note: {
        fontSize: 15,
        fontWeight: '400',
        color: 'orange',
        margin: 5,
        marginLeft: 15
    },
    confirm_button: {
        marginTop: 20,
        width: '50%',
        height: 40,
        borderWidth: 0.5,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
})