import React from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, CameraRoll } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import {connect} from 'react-redux'
import { API, Storage } from 'aws-amplify';

// var AWS = require('aws-sdk');
// AWS.config.update({
//     "region": 'us-east-2'
// });
// var s3 = new AWS.S3({
//     "accessKeyId": 'AKIAVPM4WHYNOGKNILXH', 
//     "secretAccessKey": '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',
//     "Bucket": "openclique"
// });

class AddMedia extends React.Component {

    state = {
        outputImage: false,
        medias: []
    }

    _pickImage() {

        // ImagePicker is the react native module to pick and take pictures from the phone

        ImagePicker.showImagePicker({}, async response => {
            var user = this.props.user
            var props = this.props

            // First I create a random ID, then create a path for the new file to add to the S3 bucket

            var randomId = (Date.now() + Math.random()).toString()
            var key = this.props.user.info.username + '/' + randomId

            await readFile(response.origURL).then(async buffer => {
                await Storage.put(key, buffer, {
                    contentType: response.type
                }).then(response => {
                    return response
                }).catch(e => {
                    console.log('error', e)
                })
            }).catch(e => {
                console.log(e);
            });

            let apiName = 'Openclique'
            let path = '/users/' + user.info.username + '/medias/' + randomId
            let myInit = {}

            API.post(apiName, path, myInit)
            .then(response => {
                console.log(response)
                let action = {
                    type: 'ADD_MEDIA',
                    value: {
                        media: response.Attributes.media
                    }
                }
                props.dispatch(action)
            })
            .catch(error => {
                console.log(error)
            })

            // var body = {
            //     uri: response.uri,
            //     name: response.fileName,
            //     height: response.height,
            //     width: response.width
            // }

            // console.log(body)
        
            // var params = {
            //     Bucket: 'openclique',
            //     Key: key,
            //     Body: JSON.stringify(body),
            //     ContentType: response.type
            // };
            
            // s3.upload(params, function (err, data) {
            //     if (err) {
            //         console.log(err)
            //     } else {

            //         // If the upload worked I add the ID of the s3 bucket into the database for the user

            //         let apiName = 'Openclique'
            //         let path = '/users/' + user.info.username + '/medias/' + randomId
            //         let myInit = {}

            //         API.post(apiName, path, myInit)
            //         .then(response => {
            //             console.log(response)
            //             let action = {
            //                 type: 'ADD_MEDIA',
            //                 value: {
            //                     media: response.Attributes.media
            //                 }
            //             }
            //             props.dispatch(action)
            //         })
            //         .catch(error => {
            //             console.log(error)
            //         })
            //     }
            // });
        })

    }

    async _getAllImages() {
        // Resets all the images

        this.setState({
            outputImage: false,
            medias: []
        })

        // Get rid of the trash media

        var newData = this.props.user.info.media.filter(item => item != 0)
        let total = newData.length

        var i = -1
        while(++i < total) {

            var key = this.props.user.info.username + '/' + newData[i]
            let response = await Storage.get(key, { level: 'public' })
            
            console.log(response); 

            var media = this.state.medias.concat(result)
            this.setState({
                medias: media
            })

            if (index == total - 1) {
                this.setState({
                    outputImage: true,
                })
            }

        }

        // await newData.forEach((item, index) => {
        //     // var params = {
        //     //     "Bucket": "openclique", 
        //     //     "Key": this.props.user.info.username + '/' + item
        //     // };

        //     var key = this.props.user.info.username + '/' + item
        //     Storage.get(key, { level: 'public' })
        //     .then ( (result) => { 
        //         console.log(result); 
        //         var media = this.state.medias.concat(result)
        //         this.setState({
        //             medias: media
        //         })
        //     })
        //     .catch( (err) => { 
        //         console.log(err);
        //     });
               
        //     // s3.getObject(params, (err, data) => {
        //     //     if (err) {
        //     //         console.log(err)
        //     //     } else {
        //     //         var body = JSON.parse(data.Body.toString('utf-8'))
        //     //         var media = this.state.medias.concat(body)
        //     //         this.setState({
        //     //             medias: media
        //     //         })
        //     //     }
        //     // });
        //     if (index == total - 1) {
        //         this.setState({
        //             outputImage: true,
        //         })
        //     }
        // })
    }

    render() {
        return (
            <React.Fragment>
                <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => this._pickImage()}
                >
                    <Text>Add media</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={() => this._getAllImages()}
                >
                    <Text>Get image</Text>
                </TouchableOpacity>
                <ScrollView>
                    {
                        this.state.outputImage ? this.state.medias.map(item => {
                            return (
                                <Image
                                style={{width: 375, height: 500}}
                                source={{uri: item.uri}}
                                />
                            )
                        }) : null
                    }
                </ScrollView>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(AddMedia)