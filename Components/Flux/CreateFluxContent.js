import React from 'react'
import { View, Image, Button } from 'react-native'
import { API } from 'aws-amplify'
import { connect } from 'react-redux'
import {readFile, isEmpty} from '../Functions/functions'

import Amplify, { Storage } from 'aws-amplify';
import awsmobile from '../../aws-exports';
Amplify.configure(awsmobile);


class CreateFluxContent extends React.Component {

    async _sendContentToDatabaseAndGoToFlux() {

        if (this.props.navigation.state.params.state && !isEmpty(this.props.navigation.state.params.state.review)) {

            // Case we are adding a review
            // Adds the review in the review database, and then adds the post with review into the flux database

            let user = this.props.navigation.state.params.state.user
            let review = this.props.navigation.state.params.state.review
            let apiName = 'Openclique'
            let path = '/reviews'
            let myInit = {
                body: {
                    "place_id": review.location.id,
                    "user_id": user.info.username,
                    "content": {
                        "ratings": review.ratings.fields,
                        "general": review.ratings.general,
                        "place_name": review.location.name,
                        "place_type": review.type,
                        "comment": this.props.navigation.state.params.state.text ? this.props.navigation.state.params.state.text : 'No comment'
                    }
                }
            }

            if (!isEmpty(this.props.navigation.state.params.state.media)) {

                var randomID = (Date.now() + Math.random()).toString()
                var key = user.info.username + '/' + randomID

                readFile(this.props.navigation.state.params.state.media.url).then(buffer => {
                    console.log(buffer)
                    Storage.put(key, buffer, {
                        contentType: this.props.navigation.state.params.state.media.type
                    }).then(response => {
                        console.log(response)

                        let myInit = {
                            body: {
                                "place_id": review.location.id,
                                "user_id": user.info.username,
                                "content": {
                                    "ratings": review.ratings.fields,
                                    "general": review.ratings.general,
                                    "place_name": review.location.name,
                                    "place_type": review.type,
                                    "comment": this.props.navigation.state.params.state.text ? this.props.navigation.state.params.state.text : 'No comment',
                                    media: response.key
                                }
                            }
                        }

                        API.post(apiName, path, myInit)
                        .then(response => {
                            console.log(response)
                            let action = {type: 'UPDATE_USER', value: {
                                reviews: response.Attributes.reviews
                            }}
                            this.props.dispatch(action)
                        }).catch(error => {
                            console.log(error)
                        });
                    }).catch(e => {
                        console.log(e)
                    })
                }).catch(e => {
                    console.log(e);
                });
            } else {

                await API.post(apiName, path, myInit).then(response => {
                    console.log(response)
                    let action = {type: 'UPDATE_USER', value: {
                        reviews: response.Attributes.reviews
                    }}
                    this.props.dispatch(action)
                }).catch(error => {
                    console.log(error)
                });

            }


        } else {

            // If it is not a review

            if (this.props.navigation.state.params.state && !isEmpty(this.props.navigation.state.params.state.media)) {

                // If there is a media (photo/video)

                let user = this.props.navigation.state.params.state.user
                let media = this.props.navigation.state.params.state.media
                let location = this.props.navigation.state.params.state.location
                let randomID = (Date.now() + Math.random()).toString()

                let apiName = 'Openclique'
                let path = '/users/' + user.info.username + '/medias/' + randomID

                if (!isEmpty(location)) {
                    myInit = {
                        ...myInit,
                        body: {
                            ...myInit.body,
                            flux_type: {
                                ...myInit.body.flux_type,
                                location: location
                            }
                        }
                    }
                }

                var key = user.info.username + '/' + randomID

                // Post the file to my AWS S3 bucket, then add the key to the media list for the user and the flux (in database)

                readFile(media.url).then(buffer => {
                    Storage.put(key, buffer, {
                        contentType: media.type
                    }).then(response => {

                        console.log(response)

                        let myInit = {
                            body: {
                                "path": response.key,
                                "comment": this.props.navigation.state.params.state.text.length > 0 ? this.props.navigation.state.params.state.text : 'No comment',
                                "user": user.info.username
                            }
                        }

                        API.post(apiName, path, myInit)
                        .then(response => {
                            console.log(response)
                        }).catch(error => {
                            console.log(error)
                        });
                    }).catch(e => {
                        console.log(e)
                    })
                }).catch(e => {
                    console.log(e);
                });

            } else {

                // If there is no media

                if (this.props.navigation.state.params.state && !isEmpty(this.props.navigation.state.params.state.location)) {

                    // Adds the post with location into the flux database
        
                    let user = this.props.navigation.state.params.state.user
                    let location = this.props.navigation.state.params.state.location
                    let apiName = 'Openclique'
                    let path = '/flux'
                    let myInit = {
                        body: {
                            "user_id": user.info.username,
                            "flux_type": {
                                "type": "location",
                                "location": location,
                                "comment": this.props.navigation.state.params.state.text.length > 0 ? this.props.navigation.state.params.state.text : 'No comment'
                            }
                        }
                    }
        
                    await API.post(apiName, path, myInit).then(response => {
                        console.log(response)
                    }).catch(error => {
                        console.log(error)
                    });
        
                } else {
        
                    // Adds the post into the flux database
        
                    let user = this.props.navigation.state.params.state.user
        
                    let apiName = 'Openclique'
                    let path = '/flux'
                    let myInit = {
                        body: {
                            "user_id": user.info.username,
                            "flux_type": {
                                "type": "post",
                                "comment": this.props.navigation.state.params.state.text.length > 0 ? this.props.navigation.state.params.state.text : 'null'
                            }
                        }
                    }
        
                    await API.post(apiName, path, myInit).then(response => {
                        console.log(response)
                    }).catch(error => {
                        console.log(error)
                    });
        
                }
            }
        }
        
        this.props.navigation.navigate('Flux')
    }

    render() {
        return (
            <View style={{marginRight: 20}}>
                <Button 
                title='Share'
                onPress={() => this._sendContentToDatabaseAndGoToFlux()}
                />
            </View>
        )
    }
}

export default connect()(CreateFluxContent)