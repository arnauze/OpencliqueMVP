import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Rating } from 'react-native-ratings'

import Amplify, { Storage } from 'aws-amplify';
// import awsmobile from '../../aws-exports';
// Amplify.configure(awsmobile);




// NOT USED ANYMORE FOR NOW




export default class ReviewSummary extends React.Component {

    componentWillReceiveProps() {
        if (this.props.item && this.props.item.content.media) {
            Storage.get(this.props.item.content.media, {level: 'private'})
            .then(result => {
                this.setState({
                    url: result,
                    outputImage: true
                }, () => console.log(this.state))
            })
            .catch(err => console.log(err));
        }
    }

    render() {
        const item = this.props.item
        return (
            <View style={{marginBottom: 10}}>
                {
                item ? item.content.comment === 'No comment' ? null : 
                <View style={{width: '100%', minHeight: 50, borderBottomWidth: 0.5, borderTopWidth: 0.5, justifyContent: 'center', backgroundColor: 'white'}}>
                    <Text style={{fontSize: 14, fontWeight: '400', margin: 10}}>{item.content.comment}</Text>
                </View> : null
                }
                <View style={styles.review_main_container}>
                    <View style={{alignItems: 'center', borderWidth: 0.5}}>
                        <Text style={[styles.review_header_text, { fontWeight: 'bold' }]}>{item ? item.content.place_name : null}</Text>
                        <Text style={styles.review_header_text}>{item ? item.content.place_type : null}</Text>
                        <Text style={[styles.review_header_text, { fontWeight: 'bold' }]}>General: </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Text style={[styles.review_header_text, { marginRight: 5}]}>{item ? item.content.general.rating.toFixed(1) : null}</Text>
                            <Rating 
                            count={5}
                            startingValue={item ? item.content.general.rating : null}
                            imageSize={15}
                            ratingBackgroundColor='lightgray'
                            readonly
                            />
                        </View>
                    </View>
                    <View style={styles.review_ratings_main_container}>
                        <View style={styles.review_column}>
                            {
                                item ? item.content.ratings.map((item, index) => (
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
                                )) : null
                            }
                        </View>
                        <View style={styles.review_column}>
                            {
                                item ? item.content.ratings.map((item, index) => (
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
                                )) : null
                            }
                        </View>
                    </View>
                </View>
                {
                    this._outputImage()
                }
            </View>
        )
    }

    _outputImage() {
        if (this.state && this.state.outputImage && this.state.url) {
            return (
                <TouchableOpacity>
                    <Image source={{url: this.state.url}} style={{width: 100, height: 100, alignSelf: 'center', marginTop: 10}}/>
                </TouchableOpacity>
            )
        }
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